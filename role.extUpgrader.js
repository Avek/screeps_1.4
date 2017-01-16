
module.exports = {
    run: function(creep) {
        
        var transport = creep.memory.transport;
        if(!creep.memory.storage){
            if(!creep.room.storage){
                console.log(creep.name+" has no storage to go to.");
                creep.moveTo(25,25);//get out of the way
                return;
            }else{
                creep.memory.storage = creep.room.storage.id;
            }
        }
        if(creep.ticksToLive < 1000){
            creep.memory.rest=50;//hang out by the spawn for 50 ticks to get renewed!
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
                if(creep.memory.rest && creep.memory.rest > 0){
                    if(!creep.memory.spawn){
                        var spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS);
                        if(spawn){
                            creep.memory.spawn = spawn.id;
                        }
                    }else{
                        creep.moveTo(Game.getObjectById(creep.memory.spawn));
                    }
                    creep.memory.rest-=1;
                    creep.say("zzz...");
                    return;
                }
                var container = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter: (s) => s.structureType=='container'})[0];
                if(container){
                    creep.withdraw(container, RESOURCE_ENERGY);
                }else{
                    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 2);    
                    if(creep.pickup(target) == ERR_NOT_IN_RANGE)
                        creep.say("wer enrgy?!");
                }
                    
            }
        }else{
            //todo: check for roads to repair as we go
            //if we're at the container repair it

            if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE){
                creep.moveTo(creep.room.controller);
            }
        }
    }

};