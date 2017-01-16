var roleConstructor = require('role.constructor');

module.exports = {
    // a function to run the logic for this role
    run: function(creep) {
        // if creep is trying to repair something but has no energy left

        if (creep.memory.working == true && creep.carry.energy == 0) {
            // switch state
            creep.memory.working = false;
        }
        // if creep is harvesting energy but is full
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            // switch state
            creep.memory.working = true;
        }

        // if creep is supposed to repair something
        if (creep.memory.working == true) {
            // find closest structure with less than max hits
            // Exclude walls because they have way too many max hits and would keep
            // our repairers busy forever. We have to find a solution for that later.
            if (creep.memory.subrole = 'walls') {

                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < 10000 && s.structureType == STRUCTURE_TOWER
                });
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < 10000 && s.structureType == STRUCTURE_RAMPART
                });
                if(structure == undefined) {
                    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < 10000 && s.structureType == STRUCTURE_WALL
                    });
                }
            }else {
                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < s.hitsMax && s.structureType == STRUCTURE_RAMPART
                });
                if(structure == undefined) {
                    var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => s.hits < s.hitsMax && s.structureType != STRUCTURE_WALL
                    });
                }
            }
            // if we find one
            if (structure != undefined) {
                // try to repair it, if it is out of range
                if (creep.repair(structure) == ERR_NOT_IN_RANGE) {
                    // move towards it
                    creep.moveTo(structure);
                }
            }
            // if we can't fine one
            else {
                // look for construction sites
                roleConstructor.run(creep);
            }

        }
        // if creep is supposed to harvest energy from source
        else {

            if(creep.memory.group=='alpha') {
                //var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
                target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                && s.energy > 0)})[0];
            }else{
                target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER
                && s.energy > 0)})[1];
            }
            if(target==undefined){

                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (s) => (
                    s.memory.role == 'collector'
                )});
                creep.moveTo(target);
                return;
            }
            creep.moveTo(target);
            //fill up transporters first
            //console.log(creep.name);
            //console.log(container.energyAvailable);
            if (((creep.carryCapacity-_.sum(creep.carry))>200)){
                target.transfer(creep, RESOURCE_ENERGY, 75);
            }
            target.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry));
            // find closest source
            // var source = creep.pos.findClosestByPath(FIND_SOURCES);
            // // try to harvest energy, if the source is not in range
            // if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
            //     // move towards the source
            //     creep.moveTo(source);
            // }
        }
    }
};