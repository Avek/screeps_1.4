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
        var minNumberOfCollectors = 2;
        var minNumberOfTransporters = 2;
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
        if (groupRatio) {
            spawnGroup = 'beta';
        } else
            spawnGroup = 'alpha';

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


        if (numberOfCreeps <= 3 || spawn.room.energyCapacityAvailable < 500) {
            //console.log("level 1 spawns");
            var body = [WORK, CARRY, MOVE, MOVE];
            var collectorBody = [WORK, CARRY, WORK, MOVE];
            var transporterBody = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
            var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, ATTACK, ATTACK];
        } else if (numberOfCreeps > 3 && spawn.room.energyAvailable >= 500 && spawn.room.energyCapacityAvailable < 800) {
            //console.log("level 2 spawns");
            var collectorBody = [WORK, WORK, WORK, CARRY, WORK, MOVE];
            var body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            var transporterBody = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
            var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, ATTACK, ATTACK];
        } else if (numberOfCreeps > 3 && spawn.room.energyCapacityAvailable >= 800) {
            //console.log("level 3 spawns");
            var body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            var collectorBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE]; //800
            var transporterBody = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
            var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];
        }


        if (!Game.underpop && spawn.room.energyAvailable >= 1300 && storedEnergy > 100000) {
            Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE], 'MassUpgrader1', {working: false,role: 'massUpgrader'});
            if(numberOfInterns < 3) {
                spawn.createCreep([WORK, WORK, WORK, CARRY, MOVE, CARRY, MOVE, CARRY,
                    CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY, MOVE], undefined, {
                    working: false,
                    role: 'intern'
                });
            }
        }
        if (Game.underpop) {
            if(numberOfCollectors<minNumberOfCollectors){

                    var newUnitName = spawn.createCreep(collectorBody, 'COL'+spawned+spawnGroup,
                        {working: false, group: spawnGroup, role: 'collector'});
                if(newUnitName == ERR_NAME_EXISTS || newUnitName > 0){
                    Game.spawned=spawned+1;
                }
                console.log(room+":spawning collector " + newUnitName + ':COL'+spawned+spawnGroup);
            }
            else if(numberOfTransporters<minNumberOfTransporters){

                    var newUnitName = spawn.createCreep(transporterBody, 'TRA'+spawned+spawnGroup,
                        {working: false, group: spawnGroup, role: 'transporter'});

                if(newUnitName == ERR_NAME_EXISTS || newUnitName > 0){
                    Game.spawned=spawned+1;
                }
                console.log(room+":spawning transporter " + newUnitName);
            }else if(numberOfDistributors<minNumberOfDistributors) {
                var newUnitName = spawn.createCreep(transporterBody, 'DIS'+spawned,
                    {working: false, role: 'distributor'});
                if(newUnitName == ERR_NAME_EXISTS || newUnitName > 0){
                    Game.spawned=spawned+1;
                }
                console.log(room+":spawning distributor "+newUnitName);
            }
            else if(numberOfUpgraders<minNumberOfUpgraders) {
                var newUnitName = spawn.createCreep(body, 'UPG'+spawned+spawnGroup,
                    {working: false, group: spawnGroup, role: 'upgrader'});
                if(newUnitName == ERR_NAME_EXISTS || newUnitName > 0){
                    Game.spawned=spawned+1;
                }
                console.log(room+":spawning upgrader "+newUnitName);
            }
            else if(numberOfSentries<minNumberOfSentries) {
                var newUnitName = spawn.createCreep(sentryBody, 'SEN'+spawned,
                    {working: false, role: 'sentry'});
                if(newUnitName == ERR_NAME_EXISTS || newUnitName > 0){
                    Game.spawned=spawned+1;
                }
                console.log(room+":spawning sentry " + newUnitName);
            }else if(numberOfConstructor<minNumberOfConstructors){

                    var newUnitName = spawn.createCreep(body, 'CON'+spawned+spawnGroup,
                        {working: false, group: spawnGroup, role: 'constructor'});

                if(newUnitName == ERR_NAME_EXISTS || newUnitName > 0){
                    Game.spawned=spawned+1;
                }
                console.log(room+":spawning constructor " + newUnitName);
            }
        }
    }
};


/*
 Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH],
 VIKING1, {role:'berserker'});
 [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE] // 500
 [WORK, WORK, WORK, CARRY, CARRY, MOVE, CARRY, MOVE, MOVE, CARRY, MOVE, CARRY, MOVE] // 800
 [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE] // 800
 [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH] //550
 [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, CARRY, MOVE, ATTACK, ATTACK, ATTACK] // 500
 MOVE	50	Decreases fatigue by 2 points per tick.
 WORK	100
 Harvests 2 energy units from a source per tick.

 Builds a structure for 5 energy units per tick.

 Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.

 Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.

 Upgrades a controller for 1 energy unit per tick.

 CARRY	50	Can contain up to 50 resource units.
 ATTACK	80	Attacks another creep/structure with 30 hits per tick in a short-ranged attack.
 RANGED_ATTACK	150
 Attacks another single creep/structure with 10 hits per tick in a long-range attack up to 3 squares long.

 Attacks all hostile creeps/structures within 3 squares range with 1-4-10 hits (depending on the range).

 HEAL	250	Heals self or another creep restoring 12 hits per tick in short range or 4 hits per tick at a distance.
 CLAIM	600
 Claims a neutral room controller.

 Reserves a neutral room controller for 1 tick per body part.

 Attacks a hostile room controller downgrade or reservation timer with 1 tick per 5 body parts.

 A creep with this body part will have a reduced life time of 500 ticks and cannot be renewed.

 TOUGH	10	No effect, just additional hit points to the creep's body.

 */
 
