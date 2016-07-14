
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
            //console.log(creep.name + " is going back to spawn. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {

            //not in range move to spawn
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});// && s.store < s.storeCapacity});
            //if no containers give to creep next to collector

            if(target == undefined){
                target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (s) => (s.memory.role != 'collector')});
            }
            //console.log(creep.transfer(structure, RESOURCE_ENERGY));;
            console.log(creep.name+" -> " +target.name);
            var ret = creep.transfer(target, RESOURCE_ENERGY);
            if (ret == ERR_NOT_IN_RANGE) {
                console.log(creep.name+" is not in range of"+target);
                creep.drop(RESOURCE_ENERGY);
            }else{
                creep.drop(RESOURCE_ENERGY);
            }
        }
        else {
            if(creep.memory.group=='alpha') {
                source = Game.SOURCES[0];
            }else
                source = Game.SOURCES[1];
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            //console.log(creep.getActiveBodyParts(WORK)+" energy gained");
        }
    }
};