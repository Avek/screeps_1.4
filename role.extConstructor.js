var roleConstructor = require('role.constructor');


module.exports = {
    run: function(creep) {


        if(!creep.memory.path && !creep.spawning && creep.room != Game.flags.MINE.room) {
            creep.memory.path = Room.serializePath(creep.pos.findPathTo(Game.flags.MINE));
        }else if(creep.memory.path){
            creep.moveByPath(creep.memory.path);
            if(creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49){
                delete creep.memory.path;
            }
        }
        try {
            //unstick creep
            if (!creep.memory.stuck) {
                creep.memory.stuck = 0;
            }
            if (creep.memory.lastPosx && creep.room != Game.flags.MINE.room) {
                //creep.say("stuck?");
                creep.memory.target = Game.flags.MINE;
                if (creep.fatigue == 0 &&
                    creep.memory.lastPosx == creep.pos.x && creep.memory.lastPosy == creep.pos.y &&
                    creep.memory.target.pos.x != creep.pos.x && creep.memory.target.pos.y != creep.pos.y) {
                    creep.memory.stuck = creep.memory.stuck + 1;
                    creep.say("stuck!!");
                }
                if (creep.memory.stuck > 5) {
                    creep.memory.stuck = 0;
                    delete creep.memory.path;
                }
            } else {
                creep.memory.lastPosx = creep.pos.x;
                creep.memory.lastPosy = creep.pos.y;
            }
        }catch(e){ console.log("Critical failure during the check stuck script for "+ creep.name + " : "+ e); }


        
        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to spawn. ");
        }
        if (creep.memory.working == true) {

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
                    console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');
            return;
        } else {

            var target = _.find(Game.flags.MINE.pos.lookFor(LOOK_SOURCES));
            if(target.energy == 0)
                target = _.find(Game.flags.MINE2.pos.lookFor(LOOK_SOURCES));
            var retval = creep.harvest(target);
            if (retval == ERR_NOT_IN_RANGE)
                creep.moveTo(target);
            var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
            if(Memory.SHOWCPU)
                if(elapsed>Memory.SHOWCPUTHRESHOLD)
                    console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');
            return;
        }
        
    }
};