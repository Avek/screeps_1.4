
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
            var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                || s.structureType == STRUCTURE_TOWER)
                && s.energy < s.energyCapacity
            });
            if (target == undefined) {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN)
                    && s.energy < s.energyCapacity
                });
            }

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);

                creep.say((target.id.substr(target.id.length - 5)));
            }
        }
        else {
            if(creep.memory.group=='alpha') {
                //var container = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)});
                target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)})[0];
            }else{
                target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_CONTAINER)})[1];
            }



            if(target == undefined){
                target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (s) => (
                    s.memory.group == creep.memory.group &&
                        s.memory.role == 'collector'
                )});
                creep.moveTo(target);
            }
                else
                creep.say((target.id.substr(target.id.length - 5)));
            //fill up transporters first
            //console.log(creep.name);
            //console.log(container.energyAvailable);
            /*if (((creep.carryCapacity-_.sum(creep.carry))>200)){
                target.transfer(creep, RESOURCE_ENERGY, 25);
            }*/
            if(target!=undefined) {
                target.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity - _.sum(creep.carry));
            }
            //console.log(container.transfer(creep, RESOURCE_ENERGY, creep.carryCapacity-_.sum(creep.carry))+
            //" status transferring from container to "+creep.name);

        }
    }
};