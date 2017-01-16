var CPU = require('function.CPUmonitor');
module.exports = {
    run: function(creep) {

        if(creep.name == "LinkerSpawn1"){
            var flag = Game.flags.LINKER1;
        }else if(creep.name == "LinkerSpawn2"){
            var flag = Game.flags.LINKER2;
        }else if(creep.name == "LinkerSpawn3"){
            var flag = Game.flags.LINKER3;
        }else if(creep.name == "LinkerSpawn4"){
            var flag = Game.flags.LINKER4;
        }
        if (!creep.pos.isEqualTo(flag)) {
            creep.moveTo(flag);
        }else{
            if(creep.memory.link==undefined){
                creep.memory.link=creep.pos.findInRange(FIND_MY_STRUCTURES, 2,
                    {filter: {structureType: STRUCTURE_LINK}})[0];
            }
            if(creep.memory.storage==undefined){
                creep.memory.storage=creep.pos.findInRange(FIND_STRUCTURES, 2,
                    {filter: {structureType: STRUCTURE_STORAGE}})[0];
            }
            var link = Game.getObjectById(creep.memory.link.id);
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
            if(link) {

                if (link.energy < 800) {
                    creep.transfer(link, RESOURCE_ENERGY);
                }
                /*
                if (link.energy > 400) {
                    creep.transfer(storage, RESOURCE_ENERGY);
                } else {
                    creep.transfer(link, RESOURCE_ENERGY);
                }*/
            }
        }else{
            if(link) {
                creep.withdraw(storage, RESOURCE_ENERGY);
                /*
                 creep.withdraw(link, RESOURCE_ENERGY);
                //console.log(creep.name+" withdraws " +link+" " +creep.withdraw(link, RESOURCE_ENERGY));
                if (link.energy > 400) {
                    creep.withdraw(link, RESOURCE_ENERGY);
                } else {
                    creep.withdraw(storage, RESOURCE_ENERGY);
                }*/
            }
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    }

};