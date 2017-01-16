/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.viking');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {

        if(creep.memory.siege){
            
            if(creep.room.name != Game.flags.SIEGE.room.name){
                creep.moveTo(Game.flags.SIEGE);
            }else{
                target = Game.flags.SIEGE.pos.findInRange(FIND_STRUCTURES, 0)[0];
                
                if(target){
                    //Game.flags.SIEGE.pos.findInRange(FIND_STRUCTURES, 0)[0]
                    //_.filter(Game.flags.SIEGE.pos.findInRange(FIND_STRUCTURES, 0)[0], r => r.structureType == 'controller')
                    if(_.filter(target, r => r.structureType == 'controller')){
                        creep.signController(Game.flags.SIEGE.pos.findInRange(FIND_STRUCTURES, 0)[0], "He attacked me first!");
                        creep.say("Praise GCL!");
                    }
                    creep.attack(target); 
                    return;
                }else{
                    //no structures to attack, continue normally
                }
            }
        }

        if(creep.memory.guard){
            var guard = creep.memory.guard;
            if(!creep.pos.inRangeTo(Game.flags[guard], 1)){
                creep.say(creep.moveTo(Game.flags[guard]), {ignoreDestructibleStructures: true});
                return;
            }else{
                //return;//delete me
                delete creep.memory.guard;
            }
        }else{
            delete creep.memory.guard;
        }

        var attack = true;

        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (e) => (e.owner.username != "Momo")});

/*        var targetList = [
            "58631d48c04c074e4f175185",
            "5862f0859e1c150377ed20ce",
            "58632043e7a7167e6b7be56f",
            "5862d06a680f3f61642c2c10",
            "58631d48c04c074e4f175185",
            "58631d4dc04c074e4f175188"];
            
        for(index in targetList){ 
            if(!target)
                target = Game.getObjectById(targetList[index]);
                console.log(targetList[index]);
        }*/
        //creep.say(target);
        //creep.say("DIE");
        if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS, {filter: (e) => (e.owner.username != "Momo")});

        }if (!target) {
            target = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES, {filter: (e) => (e.owner.username != "Momo")});
            if (!target) {
                target = creep.pos.findClosestByPath(FIND_HOSTILE_CONSTRUCTION_SITES, {filter: (e) => (e.owner.username != "Momo")});
            }

        }

        if (target) {
            //attack!
            creep.say("here2: " +creep.attack(target));
            if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.say("Die enemy!");
                creep.moveTo(target, {ignoreDestructibleStructures: true});
            }

        } else {
            if (creep.memory.destination != undefined) {
                if (!creep.pos.inRangeTo(Game.flags.RALLY, 1))
                    creep.moveTo(Game.flags.RALLY);
                else if (creep.memory.destination.name == 'RALLY') {
                    creep.memory.destination = Game.flags.RALLY2;
                } else if (creep.memory.destination.name == 'RALLY2') {
                    creep.memory.destination = Game.flags.RALLY3;
                } else if (creep.memory.destination.name == 'RALLY3') {
                    creep.memory.destination = Game.flags.RALLY;
                }
            }
        }
    }
};