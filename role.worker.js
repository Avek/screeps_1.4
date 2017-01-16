var roleConstructor = require('role.constructor');
var roleHelper = require('role.helper');


module.exports = {
    run: function(creep) {


        if(creep.room.controller.owner && creep.room.controller.owner.username == "Momo"){
            roleHelper.run(creep);
            return;
        }

        if(!creep.memory.sources){
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.sources = {};
            for (var i in sources) {
                creep.memory.sources[i] = sources[i].id;
            }
            if(!creep.memory.sources[1]){
                creep.memory.source = creep.memory.sources[0];
            }
        }
        if(!creep.memory.source || Game.getObjectById(creep.memory.source).energy == 0){
            for (var i in creep.memory.sources) {
                //console.log(creep.name+ " observers "+ Game.getObjectById(creep.memory.sources[i]).energy + " left in source " + creep.memory.sources[i])
                var curSource = Game.getObjectById(creep.memory.sources[i]);
                console.log(creep.name + " looks at " +curSource.id+". e=" + curSource.energy +" w=" +_.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.room.name == creep.room.name && c.memory.source == curSource.id)
                + " t="+ _.sum(curSource.room.lookForAtArea(LOOK_TERRAIN, curSource.pos.y-1, curSource.pos.x-1, curSource.pos.y+1, curSource.pos.x+1, true), (c) => c.terrain == 'plain' || c.terrain == 'swamp'));
                /*if (curSource.energy > 0
                    && _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.room.name == creep.room.name && c.memory.source == curSource.id)
                    < _.sum(curSource.room.lookForAtArea(LOOK_TERRAIN, curSource.pos.y-1, curSource.pos.x-1, curSource.pos.y+1, curSource.pos.x+1, true), (c) => c.terrain == 'plain' || c.terrain == 'swamp')+15) {
                    creep.memory.source = creep.memory.sources[i];
                }*/
                if (curSource.energy > 0
                    && _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.room.name == creep.room.name && c.memory.source == curSource.id)
                    < _.sum(Game.creeps, (c) => c.memory.role == 'worker' && c.room.name == creep.room.name)/2) {
                    creep.memory.source = creep.memory.sources[i];
                }
            }
            if(!creep.memory.source)
                console.log(creep.name + " could not find an available source!");
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to spawn. ");
        }
        if (creep.memory.working == true) {
            //creep.say("Working!");
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => ((s.structureType == STRUCTURE_EXTENSION || s.structureType == STRUCTURE_SPAWN)&& s.energy < s.energyCapacity)
                ||(s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity -200)
            });
            if(false && target == undefined){
                var target = creep.room.find(FIND_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_STORAGE)
                })[0];
            }
            if (target) {
                if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
                return;
            }
            creep.say("const");
            roleConstructor.run(creep);
            var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
            if(Memory.SHOWCPU)
                if(elapsed>Memory.SHOWCPUTHRESHOLD)
                    //console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');
            return;
        } else {
            //creep.say("noWorking!");
            var target = creep.pos.findInRange(FIND_DROPPED_ENERGY, 5);
                    if(creep.pickup(target)==ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                        return;
                    }
                        
                        
            var target = Game.getObjectById(creep.memory.source);
            if(!target || !target.energy || target.energy == 0)
                delete creep.memory.source;
            var retval = creep.harvest(target);
            //creep.say(retval);
            if (retval == ERR_NOT_IN_RANGE)
                creep.moveTo(target);
            var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
            if(Memory.SHOWCPU)
                if(elapsed>Memory.SHOWCPUTHRESHOLD)
                    //console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');
            return;
        }

    }
};