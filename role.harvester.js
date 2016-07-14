
module.exports = {
    run: function(creep) {

        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to spawn. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            //not in range move to spawn
            var structure = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_SPAWN
                || s.structureType == STRUCTURE_EXTENSION
                || s.structureType == STRUCTURE_STORAGE
                || s.structureType == STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
            });
            if (creep.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(structure);
            }
        } else if (creep.pos.findClosestByPath(FIND_DROPPED_ENERGY) != undefined) {
            var source = creep.pos.findClosestByPath(FIND_DROPPED_ENERGY);
            //not in range move to source
            if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
        else {

            var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
            //var source = creep.pos.findClosestByPath(FIND_SOURCES);
            //not in range move to source
            //if (creep.harvest(storage) == ERR_NOT_IN_RANGE) {
            creep.moveTo(container);
            //console.log(container+" transferring "+(creep.carryCapacity-creep.carry.value)+" to "+creep.name);
            //console.log(container.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry))+
            //" status transferring from container to "+creep.name);
            //console.log(creep.name+"-DEBUG: "+_.sum(creep.carry)+" <---NULL?-->"+creep.carryCapacity);
            if(container!=undefined) {
                container.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));
            }
            //creep is not working harvest energy
            //if this creep has been running back and forth too long just stick to one source
            /* var source = creep.pos.findClosestByPath(FIND_SOURCES);
             //not in range move to source
             if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
             creep.moveTo(source);
             }*/
        }
    }
};