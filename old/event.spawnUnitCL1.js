/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.spawnUnit');
 * mod.thing == 'a thing'; // true
 */

var roomDetails = "";

module.exports = {

    run: function(spawn, room) {
        //console.log("||||"+spawn+"|"+room+"||||");
//E57S4
        var minNumberOfUpgraders = 2;
        var minNumberOfRepairers = 0;
        var minNumberOfConstructors = 1;
        var minNumberOfCollectors = 1;
        var minNumberOfTransporters = 1;
        var minNumberOfSentries = 1;//2;
        var minNumberOfDistributors = 1;

        var maxCreeps = 9;//14;

        var numberOfCreeps = _.sum(Game.creeps, (c) => c.memory.role != undefined
        && c.memory.role != 'berserker'
        && c.memory.role != 'intern'
        && c.memory.role != 'explorer'
        && c.memory.role != 'extTransporter'
        && c.memory.role != 'extCollector'
        && c.memory.role != 'claimer'
        && c.memory.role != 'massUpgrader'
        && c.memory.role != 'viking'
        && c.room.name == room);
        if (spawn.room.storage)
            var storedEnergy = _.sum(spawn.room.storage.store);
        else
            var storedEnergy = 0;
        var numberOfExtensions = spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
        //find all creeps in memory and return number of harvesters
        var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.room.name == room);
        var numberOfConstructor = _.sum(Game.creeps, (c) => c.memory.role == 'constructor' && c.room.name == room);
        var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer' && c.room.name == room);
        var numberOfCollectors = _.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.room.name == room);
        var numberOfTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.room.name == room);
        var numberOfSentries = _.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.room.name == room);
        var numberOfInterns = _.sum(Game.creeps, (c) => c.memory.role == 'intern' && c.room.name == room);
        var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.room.name == room);
        var numberOfAlphas = _.sum(Game.creeps, (c) => c.memory.group == 'alpha' && c.room.name == room);
        var numberOfBetas = _.sum(Game.creeps, (c) => c.memory.group == 'beta' && c.room.name == room);
        var numberOfEnemies = spawn.room.find(FIND_HOSTILE_CREEPS).length;

        //console.log("storage energy: "+spawn.room.find(FIND_STRUCTURES,
        // {filter: {structureType: STRUCTURE_STORAGE}}).energyAvailable);
        var spawned = Math.floor((Math.random() * 100) + 1);
        var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
        var spawnGroup;

        if (spawn.spawning) {
            var spawning = spawn.spawning.name;
        } else
            var spawning = "No One";
        Game.underpop = numberOfCreeps < maxCreeps;

        console.log(spawn.name + "(#" + numberOfCreeps + "/U" + numberOfUpgraders +
            "/C" + numberOfConstructor + "/R" + numberOfRepairers +
            "/Col" + numberOfCollectors + "/Tr" + numberOfTransporters + "/Sen" + numberOfSentries +
            "/Int" + numberOfInterns +
            " || Energy: " + spawn.room.energyAvailable + "/" + spawn.room.energyCapacityAvailable +
            " || Enemies: " + spawn.room.find(FIND_HOSTILE_CREEPS).length +
            " || /Alpha" + numberOfAlphas + "/Beta" + numberOfBetas +
            " || Spawning: " + spawning +
            " || Grave: " + Memory.DECEASED.toString() +
            " || Time: " + Game.time);

        var body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        var collectorBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]; //1000
        var transporterBody = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
        var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];


        //Game.spawns.Spawn1.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CLAIM], 'Claimer5', {working: false,role: 'claimer'});
        Game.spawns.Spawn1.createCreep(
            [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK,
                CARRY, CARRY, CARRY, CARRY, CARRY, CARRY]
            , 'Constructor', {working: false, role: 'extConstructor'});

        Game.spawns.Spawn1.createCreep([MOVE, CARRY], 'Linker1', {working: false, role: 'linker'});
        Game.spawns.Spawn2.createCreep([MOVE, CARRY], 'Linker2', {working: false, role: 'linker'});
        Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 'MassUpgrader1', {working: false,role: 'massUpgrader'});
        Game.spawns.Spawn2.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 'MassUpgrader2', {working: false,role: 'massUpgrader'});

        var spawnGroup = 'alpha';
        if (numberOfCollectors < minNumberOfCollectors) {
            var newUnitName = spawn.createCreep(collectorBody, 'COL' + spawned + spawnGroup,
                {working: false, role: 'collector'});
            if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                Game.spawned = spawned + 1;
            }
            console.log(room + ":spawning collector " + newUnitName + ':COL' + spawned + spawnGroup);
        }
        if (numberOfDistributors < minNumberOfDistributors) {
            var newUnitName = spawn.createCreep(transporterBody, 'DIS' + spawned,
                {working: false, role: 'distributor'});
            if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                Game.spawned = spawned + 1;
            }
            console.log(room + ":spawning distributor " + newUnitName);
        }
        if (numberOfTransporters < minNumberOfTransporters) {

            var newUnitName = spawn.createCreep(transporterBody, 'TRA' + spawned + spawnGroup,
                {working: false, role: 'transporter'});

            if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                Game.spawned = spawned + 1;
            }
            console.log(room + ":spawning transporter " + newUnitName);
        }
    }

};

