var roleConstructor = require('role.constructor');


module.exports = {
    run: function(creep) {

        //creep.say("HERE!");
        var attack = true;
        
        if(creep.memory.reserve){
            var reserve = creep.memory.reserve;
            if(!creep.pos.inRangeTo(Game.flags[reserve], 1)){
                creep.moveTo(Game.flags[reserve]);
                return;
            }else{
                creep.reserveController(creep.room.controller);
            }
        }
        
        if(creep.memory.block){
            creep.moveTo(Game.flags.BLOCK);
        }
        
        if(creep.memory.transport){
            var transport = creep.memory.transport;
               
            if(!creep.memory.storage){
                creep.memory.storage = creep.room.storage.id;
            }
            //creep is out of energy
            if (creep.memory.working == true && _.sum(creep.carry) == 0) {
                creep.memory.working = false;
            }// creep cannot carry any more energy
            else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity)
            {
                creep.memory.working = true;
            }
            
            if(creep.memory.working == false){
                if(!creep.pos.inRangeTo(Game.flags[transport], 1)){
                    creep.moveTo(Game.flags[transport]);
                    return;
                }else{
                    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 2);

                    if(creep.pickup(target) == ERR_NOT_IN_RANGE)
                        creep.say("wer enrgy?!");
                        
                }
            }else{
                var storage;
                if(creep.memory.storage)
                    storage = Game.getObjectById(creep.memory.storage);
                else
                    return;
                if(creep.transfer(storage, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE){
                    creep.moveTo(storage);
                }
            }
        }
        
        if(creep.memory.mine){
            var mine = creep.memory.mine;
            if(!creep.pos.inRangeTo(Game.flags[mine], 1)){
                creep.moveTo(Game.flags[mine]);
                return;
            }else{
                //harvest node
                //creep.reserveController(creep.room.controller);
                if(!creep.memory.source){
                    creep.memory.source = creep.pos.findClosestByPath(FIND_SOURCES).id;
                }
                creep.harvest(Game.getObjectById(creep.memory.source));
            }
        }
        
        if (creep.name.match(/EXPLORER.*/) || creep.memory.explorer == true) {

            if(creep.memory.flag2)
                var flag = creep.flags.EXPLORE2;
            else
                var flag = Game.flags.EXPLORE;
            if(!creep.pos.isEqualTo(flag) && !creep.spawning) {

                if (creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49) {
                    delete creep.memory.path;
                    delete creep.memory.target;
                }
                if(creep.memory.flag){
                    creep.memory.target = Game.flags[creep.memory.flag];
                }
                if (creep.memory.waypoint)
                    creep.memory.target = Game.flags.WAYPOINT;
                if (!creep.memory.target)
                    creep.memory.target = flag;
                if (!creep.memory.path)
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                if (!creep.pos.inRangeTo(creep.memory.target, 3)) {
                    var ret = creep.moveByPath(creep.memory.path);
                    if (ret != 0)
                        console.log(creep.name + " attempt to move by path: " + ret + " position is: " + creep.pos.x + ", " + creep.pos.y + " serialized path: " + creep.memory.path);
                }else{
                    if(true || creep.memory.target == Game.flags.EXPLORE){
                        if(creep.name.match(/Claimer.*/)){
                            creep.memory.role='claimer';
                        }
                        if(creep.name.match(/CON.*/) || creep.memory.subrole == 'worker'){
                            creep.memory.role='worker';
                        }
                        if(creep.memory.subrole && creep.memory.subrole == 'rogue'){
                            creep.memory.role='rogue';
                        }       
                        if(creep.memory.subrole && creep.memory.subrole == 'viking'){
                            creep.memory.role='viking';
                        }  
                        if(creep.memory.subrole && creep.memory.subrole == 'constructor'){
                            creep.memory.role='constructor';
                        }
                        if(creep.memory.subrole && creep.memory.subrole == 'tank'){
                            creep.memory.role='tank';
                        }
                        if(creep.memory.subrole && creep.memory.subrole == 'tankhealer'){
                            creep.memory.role='tank';
                            creep.memory.subrole='healer';
                        }
                    }
                    delete creep.memory.waypoint;
                    delete creep.memory.path;
                    delete creep.memory.target;
                }
            }else{
                delete creep.memory.path;
                delete creep.memory.target;
            }
            return;
        }
        if (creep.name.match(/SCAVENGER.*/) || creep.memory.scavenger == true){
            if(!creep.memory.storage){
                if(creep.room.storage)
                    creep.memory.storage = creep.room.storage.id;
                else
                    creep.memory.storage = 'none';
            }
            //creep is out of energy
            if (creep.memory.working == true && _.sum(creep.carry) == 0) {
                creep.memory.working = false;

            }// creep cannot carry any more energy
            else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity)
            {
                creep.memory.working = true;
            }

            if(creep.memory.working){
                var target = "";
                if(creep.memory.storage) {
                    target = Game.getObjectById(creep.memory.storage);
                }
                creep.memory.target = target;
                var ret = creep.transfer(target, RESOURCE_ENERGY);
                
                if (ret == ERR_NOT_IN_RANGE) {
                    if(creep.memory.target && !creep.memory.path){
                        creep.say("PATHING!");
                        creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target), {ignoreCreeps: true});
                    }
                    creep.moveByPath(creep.memory.path);
                }else if(ret == OK || ret == ERR_FULL){
                    delete creep.memory.target;
                    delete creep.memory.path;
                }
            }else{
                var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 50);
                if (target) {
                    creep.say("ooOOooh!");
                    var ret = creep.pickup(target, RESOURCE_ENERGY);
                    if(ret == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
            }
            return;
        }

            if(attack == true){
            //attack!
            if (creep.name.match(/VIKING.*/) || creep.memory.viking == true) {

                var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (s) => s.owner.username != 'Momo'});

                if (!target) {

                    var target = _.find(Game.flags.ATTACK.pos.lookFor(LOOK_STRUCTURES),
                        (s) => (s.structureType == STRUCTURE_WALL)
                        || (s.structureType == STRUCTURE_TOWER)
                        || (s.structureType == STRUCTURE_SPAWN)
                        || (s.structureType == STRUCTURE_RAMPART));
                    if(!target) {

                        var target = _.find(Game.flags.ATTACKB.pos.lookFor(LOOK_STRUCTURES),
                            (s) => (s.structureType == STRUCTURE_WALL)
                            || (s.structureType == STRUCTURE_TOWER)
                            || (s.structureType == STRUCTURE_SPAWN)
                            || (s.structureType == STRUCTURE_RAMPART));
                        if(!target) {

                            var target = _.find(Game.flags.ATTACKC.pos.lookFor(LOOK_STRUCTURES),
                                (s) => (s.structureType == STRUCTURE_WALL)
                                || (s.structureType == STRUCTURE_TOWER)
                                || (s.structureType == STRUCTURE_SPAWN)
                                || (s.structureType == STRUCTURE_RAMPART));
                            if(!target) {

                                var target = _.find(Game.flags.ATTACKD.pos.lookFor(LOOK_STRUCTURES),
                                    (s) => (s.structureType == STRUCTURE_WALL)
                                    || (s.structureType == STRUCTURE_TOWER)
                                    || (s.structureType == STRUCTURE_SPAWN)
                                    || (s.structureType == STRUCTURE_RAMPART));
                            }
                        }
                    }
                }
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    //creep.say("Die enemy!");
                    creep.moveTo(target);
                }
            }
            if (creep.name.match(/Healer.*/)) {
                var target = _.find(creep.pos.findInRange(FIND_MY_CREEPS, 5),
                    (s) => (s.hits < s.hitsMax));
                if(!target){
                    var target = _.find(creep.pos.findInRange(FIND_MY_CREEPS, 5),
                        (s) => (s.name.match(/Viking.*/))
                    || (s.name.match(/Decon.*/)));
                    creep.moveTo(target);
                }else{
                    if(!creep.pos.inRangeTo(target,1)){
                        creep.moveTo(target);
                    }
                    var ret=creep.heal(target);
                   // console.log(creep.name+" heals "+target+"with return val: "+ret);
                    if(ret==ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                }
            }

            if(attack == true) {
                //attack!
                if (creep.name.match(/Deconstructor.*/)) {

                    var target = _.find(Game.flags.ATTACK.pos.lookFor(LOOK_STRUCTURES),
                        (s) => (s.structureType == STRUCTURE_WALL)
                        || (s.structureType == STRUCTURE_TOWER)
                        || (s.structureType == STRUCTURE_SPAWN)
                        || (s.structureType == STRUCTURE_RAMPART));
                    if (!target) {

                        var target = _.find(Game.flags.ATTACKB.pos.lookFor(LOOK_STRUCTURES),
                            (s) => (s.structureType == STRUCTURE_WALL)
                            || (s.structureType == STRUCTURE_TOWER)
                            || (s.structureType == STRUCTURE_SPAWN)
                            || (s.structureType == STRUCTURE_RAMPART));
                        if (!target) {

                            var target = _.find(Game.flags.ATTACKC.pos.lookFor(LOOK_STRUCTURES),
                                (s) => (s.structureType == STRUCTURE_WALL)
                                || (s.structureType == STRUCTURE_TOWER)
                                || (s.structureType == STRUCTURE_SPAWN)
                                || (s.structureType == STRUCTURE_RAMPART));
                            if (!target) {

                                var target = _.find(Game.flags.ATTACKD.pos.lookFor(LOOK_STRUCTURES),
                                    (s) => (s.structureType == STRUCTURE_WALL)
                                    || (s.structureType == STRUCTURE_TOWER)
                                    || (s.structureType == STRUCTURE_SPAWN)
                                    || (s.structureType == STRUCTURE_RAMPART));
                            }
                        }
                    }
                    //console.log(creep.name+" creep.dismantle(target) "+ target + creep.dismantle(target));
                    if (creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                        //creep.say("Die enemy!");
                        creep.moveTo(target);
                    }
                }
            }

        }else{
            if(!creep.pos.inRangeTo(Game.flags.RALLY, 4))
                creep.moveTo(Game.flags.RALLY);
        }
    }
};