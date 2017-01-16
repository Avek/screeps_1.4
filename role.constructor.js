var roleUpgrader = require('role.upgrader');
var roleCollector = require('role.collector');
var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {


        if(false&&_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.room.name == creep.room.name) < 2){
            creep.say("covering collectors");
            if(creep.memory.group == undefined){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(groupRatio){
                    creep.memory.group= 'beta';
                }else
                    creep.memory.group= 'alpha';
            }
            //roleTransporter.run(creep);
            roleCollector.run(creep);
            return;
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
            //console.log(creep.name + " is going to construction site. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            //roleUpgrader.run(creep); //change this after constructor fix
            //not in range move to spawn
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            //console.log("constructionSite:"+constructionSite);

             if(false&&_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.room.name == creep.room.name) == 0) {
                creep.say("covering transporters");
                if(creep.memory.group != 'alpha'&&creep.memory.group != 'beta'){
                    var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha' && c.room.name == creep.room.name) > _.sum(Game.creeps, (c) => c.memory.group == 'beta'  && c.room.name == creep.room.name);
                    if(groupRatio){
                        creep.memory.group= 'beta';
                    }else
                        creep.memory.group= 'alpha';
                }
                roleTransporter.run(creep);
                return;
            }else if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    console.log(creep.name+" : moving -- "+creep.moveTo(constructionSite)+"!!!!");
                }
            }else{
                
                roleUpgrader.run(creep);
                return;
            }
        }
        else {
            //creep is not working harvest energy
            //if we have too many units just pull energy from spawn
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                   filter: (s) => (s.structureType == STRUCTURE_STORAGE)});

            if(target == undefined){
                target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                   filter: (s) => (s.structureType == 'container')});
            }
            
            if(target == undefined){
                creep.say("hmf...");
                return;
            }

            creep.moveTo(target);

            target.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry));

        }
    }
};