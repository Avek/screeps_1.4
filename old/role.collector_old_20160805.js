
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


            var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {filter: (s) => (s.memory.role != 'collector')});

            //console.log(creep.transfer(structure, RESOURCE_ENERGY));;
            if(target!=undefined)
                console.log(creep.name+" -> " +target.name);
            var ret = creep.transfer(target, RESOURCE_ENERGY);
            console.log(ret);
            if (ret == ERR_NOT_IN_RANGE) {
                console.log(creep.name+" is not in range of"+target);
                creep.drop(RESOURCE_ENERGY);
            }else{
                console.log(creep.name+" having issues transferring energy: "+ret);
                creep.drop(RESOURCE_ENERGY);
            }
        }
        else {
            if(creep.memory.group=='alpha' && creep.room.find(FIND_SOURCES)[1] != undefined) {
                source = creep.room.find(FIND_SOURCES)[1];
            }else
                source = creep.room.find(FIND_SOURCES)[0];
            var retval = creep.harvest(source);
            if (retval == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }else if (retval == ERR_NOT_ENOUGH_RESOURCES) {
                if(creep.memory.group=='alpha') {
                    creep.memory.group='beta';
                }else
                    creep.memory.group='alpha';
            }
            //console.log(creep.getActiveBodyParts(WORK)+" energy gained");
        }
    }
};