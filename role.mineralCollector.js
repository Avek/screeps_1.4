
module.exports = {
    run: function(creep) {


        if (!creep.memory.mineral) {
            creep.memory.mineral = creep.room.find(FIND_MINERALS)[0].id;
        }
        
        if(!creep.memory.terminal){
            creep.memory.terminal = creep.room.terminal.id;
        }
        
        if(!creep.memory.mineralType){
            var mineralType = creep.room.find(FIND_MINERALS)[0].mineralType;
            switch (mineralType){
                case 'H':
                    creep.memory.mineralType = RESOURCE_HYDROGEN;
                    break;
                case 'O':
                    creep.memory.mineralType = RESOURCE_OXYGEN;
                    break;
            }
            
        }

        //creep is out of energy
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity)
        {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to spawn. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            var terminal = Game.getObjectById(creep.memory.terminal);
            if(terminal && creep.memory.mineralType && creep.transfer(terminal, creep.memory.mineralType) == ERR_NOT_IN_RANGE) {
                creep.moveTo(terminal);
                return;
            }
        }
        else {
            var mineral = Game.getObjectById(creep.memory.mineral);

            var retval = creep.harvest(mineral);
            if (retval == ERR_NOT_IN_RANGE) {
                    creep.moveTo(mineral);
            }
            //console.log(creep.getActiveBodyParts(WORK)+" energy gained");
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        if(Memory.SHOWCPU)
            if(elapsed>Memory.SHOWCPUTHRESHOLD)
                console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');
    }
};