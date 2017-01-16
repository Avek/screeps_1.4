/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.outpost');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(spawn){
        //800/2.5/12 = 27
        //600/12 = 50
        var creeps = spawn.pos.findInRange(FIND_MY_CREEPS,1,{filter: (e) => (e.ticksToLive < 1500)});
        creeps = _.sortBy(creeps, 'ticksToLive');
        
        var target = creeps[0];
        spawn.renewCreep(target);
    }
};