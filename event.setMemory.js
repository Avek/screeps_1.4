/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.setMemory');
 * mod.thing == 'a thing'; // true
 */

module.exports = {

    run: function() {
        //Game.creeps.Gavin.moveByPath(Game.SOURCES[1]);
        //console.log(Game.Memory.SOURCES[1]);
        if(Game.SOURCES == undefined){
            Game.SOURCES = [Game.spawns.Spawn1.room.find(FIND_SOURCES)[0],
                Game.spawns.Spawn1.room.find(FIND_SOURCES)[1]];
        }
        //console.log("DEBUG111: "+Game.room.Sources);
        //clear memory
        for(let name in Memory.creeps) {

            if (Game.creeps[name] == undefined) {
                delete Memory.creeps[name];
            }

        }
        /*
         var controller_source = Game.structures.controller.pos.findClosestByPath(FIND_SOURCES, {
         filter: (s) => (s.structureType == STRUCTURE_SPAWN
         || s.structureType == STRUCTURE_EXTENSION
         || s.structureType == STRUCTURE_STORAGE
         || s.structureType == STRUCTURE_TOWER)
         && s.energy < s.energyCapacity
         });
         console.log(controller_source.name);
         */
        var extensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_EXTENSION }});
        for(let ext in extensions){
            // console.log(Game.structures.e);
        }
        // var controller = Game.spawns.Spawn1.room.find(STRUCTURE_CONTROLLER);
        // //console.log(controller);
        // var closestextensions = controller.room.find(FIND_MY_STRUCTURES, {
        //     filter: { structureType: STRUCTURE_EXTENSION }
        // });
        // console.log(closestextensions);

        //You can't put objects in memory, but you can store the ID and Game.getObjectById
    }
};