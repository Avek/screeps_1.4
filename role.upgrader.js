
module.exports = {
    run: function(creep) {

        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to controller. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            //not in range move to spawn
            if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
        else {
            //creep is not working harvest energy
            //if this creep has been running back and forth too long just stick to one source
            //if(creep.pos.inRangeTo(FIND_SOURCES))
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
            creep.moveTo(target);
            if(target == undefined){
                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (s) => (
                    s.memory.group == creep.memory.group &&
                    s.memory.role == 'collector'
                )});
                creep.moveTo(target);
                return;
            }
            //console.log(container+" transferring "+(creep.carryCapacity-creep.carry.value)+" to "+creep.name);
            //console.log(creep.name+"-DEBUG: "+_.sum(creep.carry)+" <---NULL?-->"+creep.carryCapacity);
            console.log(target.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry))+
                " status transferring from container to "+creep.name);
            /*
             var source = creep.pos.findClosestByPath(FIND_SOURCES);
             //not in range move to source
             if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
             creep.moveTo(source);
             }*/
        }
    }
};