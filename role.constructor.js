var roleUpgrader = require('role.upgrader');
var roleCollector = require('role.collector');
var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {

        if(_.sum(Game.creeps, (c) => c.memory.role == 'collector') < 2){
            creep.say("covering collectors");
            if(creep.memory.group == undefined){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(groupRatio){
                    creep.memory.group= 'beta';
                }else
                    creep.memory.group= 'alpha';
            }
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
            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter') < 2) {
                creep.say("covering transporters");
                if(creep.memory.group != 'alpha'&&creep.memory.group != 'beta'){
                    var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                    if(groupRatio){
                        creep.memory.group= 'beta';
                    }else
                        creep.memory.group= 'alpha';
                }
                roleTransporter.run(creep);
                return;
            }else{

                roleUpgrader.run(creep);
                return;
            }
        }
        else {
            //creep is not working harvest energy
            //if we have too many units just pull energy from spawn
            if(_.sum(Game.creeps, (c) => c.memory.role != undefined) >= 14){
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION)});
                creep.moveTo(target);
                console.log(creep.name+" "+"("+creep.carryCapacity+"-"+_.sum(creep.carry)+") is pulling from "+target);
                creep.withdraw(target, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry));
                return;
                //console.log(target+" to "+creep.name);
            }

            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});

            if(target == undefined){
                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (s) => (
                    s.memory.group == creep.memory.group &&
                    s.memory.role == 'collector'
                )});
                creep.moveTo(target);
                return;
            }

            creep.moveTo(target);

            target.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry));

        }
    }
};