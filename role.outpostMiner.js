var CPU = require('function.CPUmonitor');

module.exports = {
    run: function(creep) {

        if(!creep.memory.sources){
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.sources = {};
            for (var i in sources) {
                creep.memory.sources[i] = sources[i].id;
            }
        }
        if(!creep.memory.source || !creep.memory.container){ // || Game.getObjectById(creep.memory.source).energy == 0){
            for (var i in creep.memory.sources) {
                //console.log(creep.name+ " observers "+ Game.getObjectById(creep.memory.sources[i]).energy + " left in source " + creep.memory.sources[i])
                if (Game.getObjectById(creep.memory.sources[i]).energy > 0) {
                /*    if (_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.source == sources[i].id) > 0) {
                        continue;
                    }*/
                    creep.say("Woooow!");
                    creep.memory.source = creep.memory.sources[i];
                    var container = Game.getObjectById(creep.memory.source).pos.findInRange(FIND_STRUCTURES, 1, {
                        filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
                    })[0];

                    if(container) {
                        if (_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.container == container.id) == 0) {
                            creep.memory.container = container.id;
                            break;
                        }
                    }
                }
            }
        }
        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = false;
            //console.log(creep.name + " is going back to spawn. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {

        }
        else {
            var source = Game.getObjectById(creep.memory.source);
            var container = Game.getObjectById(creep.memory.container);
            if(container && !creep.pos.isEqualTo(container.pos) && creep.fatigue == 0) {
                creep.moveTo(container);
                var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
                CPU.run(creep, elapsed);
                return;
            }else {
                var retval = creep.harvest(source);
                if (retval == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    },

    yell: function(creep) {
        creep.say("Ha!");
    }
};