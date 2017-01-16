var roleConstructor = require('role.constructor');


module.exports = {
    run: function(creep) {
    
        var transport = creep.memory.flag;
           
        if(!creep.memory.storage){
            creep.memory.storage = creep.room.storage.id;
        }
        //creep is out of energy
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }// creep cannot carry any more energy
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity)
        {
            creep.memory.working = true;
        }
        
        if(creep.memory.working == false){
            if(!creep.pos.inRangeTo(Game.flags[transport], 1)){
                creep.moveTo(Game.flags[transport]);
                return;
            }else{
                if(!creep.memory.target){
                    var target = _.filter(Game.flags[transport].pos.findInRange(FIND_STRUCTURES, 0), r => r.structureType == 'container')[0].id;
                    if(target){
                        creep.memory.target = target;
                    }
                }else{
                    if(creep.withdraw(Game.getObjectById(creep.memory.target), RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                        creep.move(Game.getObjectById(creep.memory.target));
                }
                    
            }
        }else{
            var storage;
            if(creep.memory.storage)
                storage = Game.getObjectById(creep.memory.storage);
            else
                return;
            if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                creep.moveTo(storage);
            }
        }
        
        
    }
};