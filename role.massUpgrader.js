var CPU = require('function.CPUmonitor');
module.exports = {
    run: function(creep) {

        if(!creep.memory.controllerLink){
            var target = creep.room.controller.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK});
            if(target)
                creep.memory.controllerLink = target.id;
            else
                creep.memory.controllerLink = 'none';
        }

        if(!creep.memory.storageLink){
            var target = creep.room.storage.pos.findClosestByRange(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_LINK});
            if(target)
                creep.memory.storageLink = target.id;
            else
                creep.memory.storageLink = 'none';
        }

        //define pickup
        if(!creep.memory.pickup) {

            var target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE)})[0];
            if(target){
                creep.memory.pickup = target.id;
            }
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;
        }
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
        }
        if (creep.memory.working == true) {
            creep.say("wowowooo...");
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {

            var target = Game.getObjectById(creep.memory.controllerLink);
            if(target != null) {
                
                if (target.energy > 0) {
                    var ret = creep.withdraw(target, RESOURCE_ENERGY);
                    creep.say(ret);
                    if (ret == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else if (target.energy == 0) { //ring bell to call in more resources!

                    var linkOut = Game.getObjectById(creep.memory.storageLink);
                    linkOut.transferEnergy(target);
                }
            }else{ // no links defined, grab from storage
                creep.say("eeeeh...");
                target = Game.getObjectById(creep.memory.pickup);
                if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }
            
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    }
};