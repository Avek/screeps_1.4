/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.distributor');
 * mod.thing == 'a thing'; // true
 */
var CPU = require('function.CPUmonitor');

module.exports = {
    run: function(creep) {
        /*
         delete creep.memory.pickup;
         delete creep.memory.start_id;
         delete creep.memory.end_id;
         delete creep.memory.path;
         delete creep.memory.negpath;
         delete creep.memory.destination;
         */
        //define room
        if(!creep.memory.area){
            creep.memory.area = creep.room.name;
        }

        //define pickup
        if(!creep.memory.pickup) {

            var target = creep.room.find(FIND_STRUCTURES, {filter: (s) => (s.structureType == STRUCTURE_STORAGE)})[0];
            if(target){
                creep.memory.pickup = target.id;
            }
        }
        if(!creep.memory.start_id){
            try {
                var flag = _.find(creep.room.find(FIND_FLAGS), (s) => (s.name.match(/DIS_START.*/)));
                creep.memory.start_id = _.find(flag.pos.lookFor(LOOK_STRUCTURES),
                    (s) => (s.structureType == STRUCTURE_ROAD)).id;
                //check for mid flag only once
                /* if(!creep.memory.mid_id){
                 var flag = _.find(creep.room.find(FIND_FLAGS), (s) => (s.name.match(/DIS_MID.*!/)));
                 creep.memory.mid_id = _.find(flag.pos.lookFor(LOOK_STRUCTURES),
                 (s) => (s.structureType == STRUCTURE_ROAD)).id;
                 }*/
            }catch(e){console.log(e.trace);}
        }
        if(!creep.memory.end_id){
            var flag = _.find(creep.room.find(FIND_FLAGS), (s) => (s.name.match(/DIS_END.*/)));
            creep.memory.end_id = _.find(flag.pos.lookFor(LOOK_STRUCTURES),
                (s) => (s.structureType == STRUCTURE_ROAD)).id;
        }

        if(!creep.memory.path){
            creep.say("PATHING!");
    /*        if(creep.memory.mid_id){
                creep.memory.path = Room.serializePath(Game.getObjectById(creep.memory.start_id).pos.findPathTo(Game.getObjectById(creep.memory.mid_id),{ignoreCreeps: true}));
                creep.memory.path = creep.memory.path+Room.serializePath(Game.getObjectById(creep.memory.mid_id).pos.findPathTo(Game.getObjectById(creep.memory.end_id),{ignoreCreeps: true}));
            }*/
            creep.memory.path = Room.serializePath(Game.getObjectById(creep.memory.start_id).pos.findPathTo(Game.getObjectById(creep.memory.end_id),{ignoreCreeps: true}));
        }
        if(!creep.memory.negpath){
            creep.say("PATHING!");
  /*          if(creep.memory.mid_id){
                creep.memory.negpath = Room.serializePath(Game.getObjectById(creep.memory.end_id).pos.findPathTo(Game.getObjectById(creep.memory.mid_id), {ignoreCreeps: true}));
                creep.memory.negpath = creep.memory.negpath+Room.serializePath(Game.getObjectById(creep.memory.mid_id).pos.findPathTo(Game.getObjectById(creep.memory.start_id), {ignoreCreeps: true}));
            }*/
                creep.memory.negpath = Room.serializePath(Game.getObjectById(creep.memory.end_id).pos.findPathTo(Game.getObjectById(creep.memory.start_id), {ignoreCreeps: true}));
        }
        if(!creep.memory.destination){
            creep.memory.destination = creep.memory.end_id;
            console.log(creep.name +" set destination: "+creep.memory.destination);
        }

        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0)
            creep.memory.working = false;
        // creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
            creep.memory.working = true;

        var roomEnergy = creep.room.energyAvailable;
        if(roomEnergy != creep.room.energyCapacityAvailable) {
            //creep is working transfer energy
            if (creep.memory.working == true) {

                //not in range move to spawn
                var target = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                    filter: (s) => (s.structureType == STRUCTURE_SPAWN)
                    && s.energy < s.energyCapacity
                })[0];
                if (!target) {
                    var target = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
                        filter: (s) => ((s.structureType == STRUCTURE_EXTENSION && s.energy < s.energyCapacity)
                            || (s.structureType == STRUCTURE_TOWER && s.energy < s.energyCapacity - 200)

                        )})[0];
                }

                if (!target || target == "") {
                    if (Game.getObjectById(creep.memory.destination) == (Game.getObjectById(creep.memory.end_id)))
                        var ret = creep.moveByPath(creep.memory.path);
                    else if (Game.getObjectById(creep.memory.destination) == (Game.getObjectById(creep.memory.start_id)))
                        var ret = creep.moveByPath(creep.memory.negpath);
                    console.log(creep.name + " " +ret);

                    if (ret == -5) {
                        ret = creep.moveTo(Game.getObjectById(creep.memory.start_id));
                        creep.say("lost!!");
                        if (ret != 0) {
                            console.log(creep.name + ": failed to move to spawn --" + ret);
                        }
                    }
                } else
                    creep.transfer(target, RESOURCE_ENERGY);

                if (creep.pos.isEqualTo(Game.getObjectById(creep.memory.end_id).pos)) {
                    creep.memory.destination = creep.memory.start_id;
                } else if (creep.pos.isEqualTo(Game.getObjectById(creep.memory.start_id).pos)) {
                    creep.memory.destination = creep.memory.end_id;
                }
            } else {

                creep.memory.destination = creep.memory.start_id;
                var pickup = Game.getObjectById(creep.memory.pickup);

                var retval = creep.withdraw(pickup, RESOURCE_ENERGY)
                if (retval == ERR_NOT_IN_RANGE) {
                    var ret = creep.moveByPath(creep.memory.negpath);
                    console.log(creep.name + " move to storage : " + ret);
                    if (ret == -5) {
                        creep.say("lost!!");
                        creep.moveTo(Game.getObjectById(creep.memory.start_id));
                    }
                }else if(retval == ERR_INVALID_TARGET){ //even if someone destroys storage, pick up remnants and continue to supply base
                    //creep.say("Hello!");
                    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 2);
                    if(creep.pickup(target)==ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                }
            }
        }else {
            creep.say(roomEnergy +"=="+ creep.room.energyCapacityAvailable);
            //if(_.find(Game.structures, (c) => c.room.name == creep.room.name && c.structureType == STRUCTURE_TOWER && c.energy < c.energyCapacity-200)) {
                if (creep.memory.working == true) {
                    var target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                        filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                        || s.structureType == STRUCTURE_TOWER)
                        && s.energy == 0
                    });
                    if(!target){
                        target = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                            filter: (s) => (s.structureType == STRUCTURE_EXTENSION
                            || s.structureType == STRUCTURE_TOWER)
                            && s.energy < s.energyCapacity - 200
                        });
                    }

                    if (creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE)
                        creep.moveTo(target);
                } else {
                    var pickup = Game.getObjectById(creep.memory.pickup);

                    if (creep.withdraw(pickup, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(pickup);
                    }
                }
            //}
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
        //console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');
    }
};