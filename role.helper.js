var roleConstructor = require('role.constructor');


module.exports = {
    run: function(creep) {
        return;

        if(!(creep.room == Game.flags.HELP.room || creep.room == Game.flags.EXTERNAL_SOURCE.room)){
            creep.moveTo(Game.flags.HELP);
            return;
        }

        if(!creep.memory.sources){
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.sources = {};
            for (var i in sources) {
                creep.memory.sources[i] = sources[i].id;
            }
        }
        if(!creep.memory.source){

        }
        if(!creep.memory.containers){
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER)
            });
            containers.sort(function(a,b){return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]});

            creep.memory.containers = {};
            for (var i in containers) {
                creep.memory.containers[i] = containers[i].id;
            }
        }
        try{
            //if no container is defined or the container in memory is empty...
            if(!creep.memory.container || Game.getObjectById(creep.memory.container).store[RESOURCE_ENERGY] == 0) {
                if(creep.memory.containers.length == 0){
                    creep.memory.scavenger = true;
                }
                for (var i in creep.memory.containers) {
                    //console.log(creep.name + " observers " + Game.getObjectById(creep.memory.containers[i]).energy + " left in container " + creep.memory.containers[i])
                    if (Game.getObjectById(creep.memory.containers[i]).store[RESOURCE_ENERGY] > 0) {
                        creep.memory.container = creep.memory.containers[i];
                        break;
                    }
                }
            }
        }catch(e){//console.log("Transporter script issue: "+creep.name + " " +e);
        }

        if (creep.memory.working == true && creep.carry.energy == 0) {
            //console.log(creep.name + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
            //console.log(creep.name + " is going back to spawn. ");
        }
        if (creep.memory.working == true) {
            if(!(creep.room == Game.flags.HELP.room)){
                creep.moveTo(Game.flags.HELP);
                return;
            }

            //Game.creeps.HELPER01.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => ((s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity)})
            //Game.creeps.HELPER01.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)
            if(false && !creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES)){
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => ((s.structureType == STRUCTURE_TOWER) && s.energy < s.energyCapacity)});
                if(target) {
                    var ret = creep.transfer(target, RESOURCE_ENERGY);
                    if(ret == ERR_NOT_IN_RANGE){
                        creep.move(target);
                    }
                }
                return;
            }
            creep.say("const");
            roleConstructor.run(creep);
            return;
        } else {
            try {
/*                if(false && creep.memory.container && Game.getObjectById(creep.memory.container).store.energy > 0) {
                    var target = Game.getObjectById(creep.memory.container);
                    if (target) {
                        var ret = creep.withdraw(target, RESOURCE_ENERGY);

                        if (ret == ERR_NOT_IN_RANGE) {
                            if (!creep.memory.path)
                                creep.say("PATHING!");
                            creep.memory.path = Room.serializePath(creep.pos.findPathTo(target), {ignoreCreeps: true});
                            creep.moveByPath(creep.memory.path);
                        } else {
                            delete creep.memory.path;
                        }
                    }
                    return;
                }*/

                if(!(creep.room == Game.flags.EXTERNAL_SOURCE.room)){
                    creep.moveTo(Game.flags.EXTERNAL_SOURCE);
                    return;
                }

                if (!creep.memory.source) {
                    var destination = Game.flags.EXTERNAL_SOURCE;
                    var found = Game.flags.EXTERNAL_SOURCE.pos.lookFor(LOOK_SOURCES);

                    console.log(creep.name + " setting memory...");
                    if (found && found.length) {
                        creep.memory.source = found[0].id;
                    }
                } else {
                    var source = Game.getObjectById(creep.memory.source);
                    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                        var ret = creep.moveTo(source);
                    }
                    //creep.say("HERE!"+ret);
                }
            }catch(e){console.log(creep+": "+e.stack);}

        }

    }
};