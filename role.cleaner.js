/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.viking');
 * mod.thing == 'a thing'; // true
 */
// || (creep.memory.retreat && creep.memory.retreat == true)
module.exports = {
    run: function(creep) {

        if(creep.room.find(FIND_FLAGS, {filter: {name: 'CLEAN'}}).length > 0){
            var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: {structureType: 'container'}});
            if(target && creep.dismantle(target) == ERR_NOT_IN_RANGE){
                creep.moveTo(target);
            }
        }else{
            creep.moveTo(Game.flags.CLEAN);
        }

    }
};