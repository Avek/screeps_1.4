
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
            filter: (s) => (s.structureType == STRUCTURE_SPAWN)
            && s.energy < s.energyCapacity
            });

            if (target == undefined) {
                var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                    || s.structureType == STRUCTURE_TOWER)
                    && s.energy < s.energyCapacity
                });

                if (target == undefined) {
                    var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_STORAGE)
                    });
                }
                //console.log("transporter "+creep.name+" -> "+target);
            }

            if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);

                //creep.say((target.id.substr(target.id.length - 5)));
            }
        }
        else {
            if(!(creep.name=='distributor1' || creep.name=='distributor2')) {
                var numberOfCollectors = _.sum(Game.creeps, (c) => c.memory.role != undefined
                && c.memory.role == 'collector'
                && c.room.name == creep.room.name);

                //no collectors, take from storage
                if (numberOfCollectors == 0) {
                    target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE)})[0];
                    if (target) {
                        if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(target);
                            return;
                        }
                    }
                }

                var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 3);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.say("oooh");
                        creep.moveTo(target);
                    }
                }

                if (target == undefined) {
                    target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                        filter: (s) => (
                            s.memory.group == creep.memory.group &&
                            s.memory.role == 'collector'
                        )
                    });

                    if (target == undefined) {
                        console.log(creep.name + " take from " + target);
                        target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                            filter: (s) => (
                                s.memory.role == 'collector'
                            )
                        });
                    }
                    //console.log(creep.name+"VBCVBC"+target);
                    creep.moveTo(target);
                }
            }else{
                target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE)})[0];
                if (target) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                        return;
                    }
                }
            }
        }
    }
};