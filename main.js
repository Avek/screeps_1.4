var eventSpawnUnit = require('event.spawnUnit');
var eventSetMemory = require('event.setMemory');
var eventPerformRoles = require('event.performRoles');


//var roomLogPath = "c:\\Users\\dougb\\AppData\\Local\\Screeps\\scripts\\screeps.com\\default\\room.log";
//var roomLog = new File(roomLogPath);
//roomLog.open("w");

module.exports.loop = function () {
    //Game.rooms.W31S47.memory.harvest = 0;
//49,35 EAST EDGE ROOM 1
//5,49 SOUTH EDGE ROOM 2
// 25,25 ENEMY SPAWN ROOM 3
    // Game.creeps.MOUNTAIN.moveTo(25,25);
    // Game.creeps.SIR_GREGOR.moveTo(25,25);
    //Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE], 'SIR_GREGOR', undefined);


    /*
     Game.creeps.Cooper.moveTo(27,15);
     Game.creeps.Cooper.pickup(Game.creeps.Cooper.pos.findClosestByRange(FIND_DROPPED_ENERGY));
     Game.creeps.Cooper.moveTo(Game.creeps.Cooper.pos.findClosestByPath(FIND_MY_STRUCTURES, {
     filter: (s) => (s.structureType == STRUCTURE_EXTENSION
     && s.energy < s.energyCapacity)
     }));
     Game.creeps.Gavin.transfer(Game.creeps.Cooper.pos.findClosestByPath(FIND_MY_STRUCTURES, {
     filter: (s) => (s.structureType == STRUCTURE_EXTENSION
     && s.energy < s.energyCapacity)
     }), RESOURCE_ENERGY)
     var target = Game.creeps.Gavin.pos.findClosestByRange(FIND_DROPPED_ENERGY);
     console.log(Game.creeps.Gavin.carry.energy+ " \< "+ Game.creeps.Gavin.carryCapacity);
     if(Game.creeps.Gavin.carry.energy < Game.creeps.Gavin.carry.capacity ){
     if(Game.creeps.Gavin.pickup(target, Game.creeps.Gavin.carryCapacity) == ERR_NOT_IN_RANGE)
     Game.creeps.Gavin.moveTo(27,15);
     return;
     }else{
     var structure = Game.creeps.Gavin.pos.findClosestByPath(FIND_MY_STRUCTURES, {
     filter: (s) => (s.structureType == STRUCTURE_EXTENSION
     && s.energy < s.energyCapacity)
     });
     if (Game.creeps.Gavin.transfer(structure, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
     // Game.creeps.Gavin.moveTo(structure);
     }
     }*/

    //console.log("TICK!!=======================================================");
    eventSetMemory.run();
    eventSpawnUnit.run();
    eventPerformRoles.run();

}