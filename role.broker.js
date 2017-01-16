var CPU = require('function.CPUmonitor');
module.exports = {
    run: function(creep) {

        if(creep.name == "Broker1"){
            var flag = Game.flags.BROKER1;
        }else if(creep.name == "Linker2"){
            var flag = Game.flags.LINKER2;
        }else if(creep.name == "Linker3"){
            var flag = Game.flags.LINKER3;
        }else if(creep.name == "Linker4"){
            var flag = Game.flags.LINKER4;
        }
        if (!creep.pos.isEqualTo(flag)) {
            creep.moveTo(flag);
        }else{
            if(creep.memory.terminal==undefined){
                creep.memory.terminal=creep.pos.findInRange(FIND_MY_STRUCTURES, 2,
                    {filter: {structureType: STRUCTURE_TERMINAL}})[0];
            }
            if(creep.memory.storage==undefined){
                creep.memory.storage=creep.pos.findInRange(FIND_STRUCTURES, 2,
                    {filter: {structureType: STRUCTURE_STORAGE}})[0];
            }
            var terminal = Game.getObjectById(creep.memory.terminal.id);
            var storage = Game.getObjectById(creep.memory.storage.id);
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to spawn. ");
        }

        if (creep.memory.working == true) {

                    creep.say(creep.transfer(terminal, RESOURCE_ENERGY));
        }else{
                creep.withdraw(storage, RESOURCE_ENERGY);
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    }

};