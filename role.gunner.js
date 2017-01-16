var CPU = require('function.CPUmonitor');
module.exports = {
    run: function(creep) {


        if (!creep.memory.ammoboxes) {
            var ammoboxes = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (s) => (s.structureType == STRUCTURE_TOWER)}).length > 0)
            });
            creep.memory.ammoboxes = {};
            for (var i in ammoboxes) {
                creep.memory.ammoboxes[i] = ammoboxes[i].id;
            }
        }

        try {
            //if no ammobox is defined or the ammobox is full...
            if (!creep.memory.ammobox || Game.getObjectById(creep.memory.ammobox).store[RESOURCE_ENERGY] == 0) {
                for (var i in creep.memory.ammoboxes) {
                    //console.log(creep.name + " observers " + Game.getObjectById(creep.memory.containers[i]).energy + " left in container " + creep.memory.containers[i])
                    if (Game.getObjectById(creep.memory.ammoboxes[i]).store[RESOURCE_ENERGY] > 0
                        && _.sum(Game.creeps, (c) => c.memory.role == 'gunner' && c.room.name == creep.room.name && c.memory.ammobox == creep.memory.ammoboxes[i])==0) {
                        creep.memory.ammobox = creep.memory.ammoboxes[i];
                        break;
                    }
                }
            }

            if (creep.memory.ammobox && !creep.pos.isEqualTo(Game.getObjectById(creep.memory.ammobox).pos)) {
                creep.moveTo(Game.getObjectById(creep.memory.ammobox).pos);
            }
        }catch(e){console.log(e.stacktrace);}

        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }

        if (creep.memory.working == true) {
            var target = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                filter: (s) => (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity-200)
                })[0];
            creep.transfer(target, RESOURCE_ENERGY);
        } else {
            if (creep.memory.ammobox) {
                var ammobox = Game.getObjectById(creep.memory.ammobox);
                creep.withdraw(ammobox, RESOURCE_ENERGY);
            }
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    }


};