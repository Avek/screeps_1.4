
module.exports = {
    run: function(creep) {
        
        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            console.log(creep + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
            console.log(creep + " is going back to spawn. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            //not in range move to spawn
            if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.spawns.Spawn1);
            }
        }
        else {
            //creep is not working harvest energy
            //if this creep has been running back and forth too long just stick to one source
            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            //not in range move to source
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
        }
    }
};