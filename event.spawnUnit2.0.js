/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.spawnUnit');
 * mod.thing == 'a thing'; // true
 */
/*

{2016-09-15 12:42:45 AM} added spawn cooldown for less consecutive weak bodies


do not refer to any spawn directly


 */
var CPU = require('function.CPUmonitor');
var roomDetails = "";

module.exports = {

    run: function(spawn) {


        if(!spawn){
            return;
        }
        var room = spawn.room.name;

        var startCpu = Game.cpu.getUsed();

        spawn.memory.startCpu = startCpu;

        if(!spawn.memory.sourceCount){
            spawn.memory.sourceCount = spawn.room.find(FIND_SOURCES).length;
        }

        //every 100 ticks looks for new external referenced flags
        //wtf was this even for I'm afraid to get rid of it
        if(Game.time%100){
            spawn.memory.extFlags = [];
            for(var i in Game.flags) {
                if(Game.flags[i].name.endsWith(spawn.room.name)) {
                    spawn.memory.extFlags.push(Game.flags[i]);
                }
            }
        }
        //console.log("||||"+spawn+"|"+room+"||||");
//E57S4
        var minNumberOfUpgraders = 2;
        var minNumberOfRepairers = 0;
        var minNumberOfConstructors = 1;
        var minNumberOfCollectors = spawn.memory.sourceCount;
        var minNumberOfTransporters = 1;
        var minNumberOfSentries = 1;//2;
        var minNumberOfDistributors = 1;

        var spawnCooldown = 50;

        var shouldSpawnMinus = (spawn.room.energyAvailable <= 300);
        var shouldSpawnReg = (spawn.room.energyAvailable <= 1500 && spawn.room.energyAvailable > 300);
        var shouldSpawnPlus = (spawn.room.energyAvailable >= 1800);

        var maxCreeps = 9;//14;

        if (!spawn.memory.lastSpawned) {
            spawn.memory.lastSpawned = 0;
        }
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
        //var numberOfExtensions = spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
        //find all creeps in memory and return number of harvesters
        var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader' && c.room.name == room);
        var numberOfConstructor = _.sum(Game.creeps, (c) => c.memory.role == 'constructor' && c.room.name == room);
        //var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer' && c.room.name == room);
        var numberOfCollectors = _.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.room.name == room);
        var numberOfTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.room.name == room);
        var numberOfSentries = _.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.room.name == room);
        //var numberOfInterns = _.sum(Game.creeps, (c) => c.memory.role == 'intern' && c.room.name == room);
        var numberOfDistributors = _.sum(Game.creeps, (c) => c.memory.role == 'distributor' && c.room.name == room);
        //var numberOfAlphas = _.sum(Game.creeps, (c) => c.memory.group == 'alpha' && c.room.name == room);
        //var numberOfBetas = _.sum(Game.creeps, (c) => c.memory.group == 'beta' && c.room.name == room);
        //var numberOfEnemies = spawn.room.find(FIND_HOSTILE_CREEPS).length;

        //console.log("storage energy: "+spawn.room.find(FIND_STRUCTURES,
        // {filter: {structureType: STRUCTURE_STORAGE}}).energyAvailable);
        var spawned = Math.floor((Math.random() * 100) + 1);
        //var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
        var spawnGroup;
        var body = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        var collectorBodyMinus = [WORK, WORK, MOVE, MOVE]; //300
        var collectorBody = [WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE]; //1000
        var collectorBodyPlus = [WORK, WORK, WORK, WORK, WORK, WORK,
            MOVE, MOVE, MOVE, MOVE]; //1800
        var transporterBody = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE]; //1200
        var transporterBodyMinus = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE]; //300
        var transporterBodyPlus = [CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE, CARRY, CARRY, MOVE]; //1500

        var oldProg;
        var delta;
        var timeToUpgrade;
        
            oldProg=spawn.memory.lastControllerProgress;
            delta=spawn.room.controller.progress-oldProg;
            timeToUpgrade=((spawn.room.controller.progressTotal - spawn.room.controller.progress)/delta)*(Game.time%10 || 10); //progress left divided by change multiplied by the time in ticks or 10 incase of 0
        if(Game.time%10==0){
            spawn.memory.lastControllerProgress = spawn.room.controller.progress;
        }
        console.log(spawn.name + " ticks to upgrade: " + timeToUpgrade);
     

        var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK];

        if (spawn.spawning) {
            var spawning = spawn.spawning.name;
        } else
            var spawning = "No One";

        var calcNextSpawnCPU = Game.cpu.getUsed();
        if (numberOfDistributors < minNumberOfDistributors && spawn.room.storage) {
            var newUnitName;
            //console.log(spawn.name + "   Made it here!!!! #############################################");
            if(spawn.name == 'Spawn1'){
                console.log("SPAWN 1: "+ spawn.canCreateCreep(transporterBodyMinus, 'DIS' + spawned));
            }
            if (shouldSpawnMinus && spawn.canCreateCreep(transporterBodyMinus, 'DIS' + spawned) == 0) {
                newUnitName = spawn.createCreep(transporterBodyMinus, 'DIS' + spawned,
                    {working: false, role: 'distributor'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning distributor " + newUnitName);
            } else if (shouldSpawnReg && spawn.canCreateCreep(transporterBody, 'DIS' + spawned) == 0) {
                newUnitName = spawn.createCreep(transporterBody, 'DIS' + spawned,
                    {working: false, role: 'distributor'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
            } else if (spawn.canCreateCreep(transporterBodyPlus, 'DIS' + spawned) == 0) {
                newUnitName = spawn.createCreep(transporterBodyPlus, 'DIS' + spawned,
                    {working: false, role: 'distributor'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
            }
            console.log("<h1><b><font color=\"red\">"+newUnitName+"</font></b></h1>");
            if(!newUnitName || newUnitName == ERR_NOT_ENOUGH_ENERGY){
                newUnitName = spawn.createCreep(transporterBodyMinus, 'DIS' + spawned,
                    {working: false, role: 'distributor'});
            }
            console.log(room + ":spawning distributor " + newUnitName);
        } else if (numberOfCollectors < minNumberOfCollectors && spawn.memory.lastSpawned > spawnCooldown) {
            if (shouldSpawnMinus && spawn.canCreateCreep(collectorBodyMinus, 'COL' + spawned) == 0) {
                var newUnitName = spawn.createCreep(collectorBodyMinus, 'COL' + spawned,
                    {working: false, role: 'collector'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning collector " + newUnitName + ':COL' + spawned + spawnGroup);
            } else if (shouldSpawnReg && spawn.canCreateCreep(collectorBody, 'COL' + spawned) == 0) {
                var newUnitName = spawn.createCreep(collectorBody, 'COL' + spawned,
                    {working: false, role: 'collector'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning collector " + newUnitName + ':COL' + spawned + spawnGroup);
            } else if (spawn.canCreateCreep(collectorBodyPlus, 'COL' + spawned) == 0) {
                var newUnitName = spawn.createCreep(collectorBodyPlus, 'COL' + spawned,
                    {working: false, role: 'collector'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning collector " + newUnitName + ':COL' + spawned + spawnGroup);
            }
        } else if (numberOfTransporters < minNumberOfTransporters && spawn.memory.lastSpawned > spawnCooldown) {
            if (shouldSpawnMinus && spawn.canCreateCreep(transporterBodyMinus, 'TRA' + spawned) == 0) {
                var newUnitName = spawn.createCreep(transporterBodyMinus, 'TRA' + spawned,
                    {working: false, role: 'transporter'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning transporter " + newUnitName);
            } else if (shouldSpawnReg && spawn.canCreateCreep(transporterBody, 'TRA' + spawned) == 0) {
                var newUnitName = spawn.createCreep(transporterBody, 'TRA' + spawned,
                    {working: false, role: 'transporter'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning transporter " + newUnitName);
            } else if (spawn.canCreateCreep(transporterBodyPlus, 'TRA' + spawned) == 0) {
                var newUnitName = spawn.createCreep(transporterBodyPlus, 'TRA' + spawned,
                    {working: false, role: 'transporter'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning transporter " + newUnitName);
            }
        } else if (numberOfSentries < minNumberOfSentries) {
            if (spawn.canCreateCreep(sentryBody, 'SEN' + spawned) == 0) {
            /*Game.spawns.Spawn1.createCreep([
                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK,
                ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL
                ], 'SK_Buster', {role: 'sentry', sk_buster:true});*/
                var newUnitName = spawn.createCreep(sentryBody, 'SEN' + spawned,
                    {working: false, role: 'sentry'});
                if (newUnitName == ERR_NAME_EXISTS || newUnitName > 0) {
                    Game.spawned = spawned + 1;
                }
                spawn.memory.lastSpawned = 0;
                console.log(room + ":spawning sentry " + newUnitName);
            }
        } else if (false && Game.cpu.bucket>5000){
            for(var i in spawn.memory.extFlags) {
                if(spawn.memory.extFlags[i].name.endsWith(spawn.room.name)) {
                    console.log(spawn.name + " sends creeps to "+ spawn.memory.extFlags[i]);
                    var area = spawn.memory.extFlags[i].pos.roomName;
                    var colCreepName = "COL"+area;
                    var flag = spawn.memory.extFlags[i];
                    if(spawn.canCreateCreep(collectorBody, colCreepName)==0 && spawn.memory.lastSpawned > spawnCooldown){
                        console.log(spawn.name+" spawning "+collectorBody+" "+colCreepName+" area:"+area+" flag:"+flag);
                        spawn.createCreep(collectorBody, colCreepName, {role:'extCollector', area:area, flag:flag});
                        spawn.memory.lastSpawned = 0;
                    }
                }
            }
        }

        if (spawn.room.controller.ticksToDowngrade < 11000) {
            spawn.createCreep(body, 'UPG' + spawn.name, {working: false, role: 'upgrader'});
        }

        spawn.memory.lastSpawned++;

        Game.underpop = numberOfCreeps < maxCreeps;
        console.log("<b><font color=\"red\">" + spawn.name + "</font> #" + numberOfCreeps + "/Upg" + numberOfUpgraders +
            "/Con" + numberOfConstructor +
            "/Col" + numberOfCollectors + "/Tr" + numberOfTransporters + "/Sen" + numberOfSentries +
            " || Energy: " + spawn.room.energyAvailable + "/" + spawn.room.energyCapacityAvailable +
            " || Enemies: " + spawn.room.find(FIND_HOSTILE_CREEPS).length +
            " || Spawning: " + spawning +
            " || TTU: " + timeToUpgrade + "</b>");


        var enemies = spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 999);

        var heal;
        if (enemies) {
            var report = "";
            //console.log("enemies type " +typeof enemies); //object
            for (var i in enemies) {
                var enemy = enemies[i];
                report = report + " " + enemy.name;
                //console.log("enemy type " +typeof enemy); //string
                for (var j in enemy.body) {
                    var part = enemy.body[j]
                    report = report + " " + part.type;
                    if (part.type == 'heal')
                        heal = true;
                }
                if (heal) {
                    console.log("heal part found in " + enemy.name);
                    spawn.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE,
                        ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK
                    ], 'HealBuster', {role: 'sentry'});
                }
            }
        }

        if(spawn.room.storage) {
            if (_.sum(spawn.room.storage.store) > 500000) {
                if(spawn.room.controller.level >= 5) {
                    spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU1' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU2' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    if (_.sum(spawn.room.storage.store) > 750000) {
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU3' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU4' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    }
                    if (_.sum(spawn.room.storage.store) > 900000) {
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU5' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU6' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    }
                    if (spawn.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_LINK}}).length > 0) {
                        spawn.createCreep([MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY], 'Linker' + spawn.name, {
                            working: false,
                            role: 'linker'
                        });
                    }
                } else {
                    spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1300
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU1' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1300
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU2' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    if (_.sum(spawn.room.storage.store) > 750000) {
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1300
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU3' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1300
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU4' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    }
                    if (_.sum(spawn.room.storage.store) > 900000) {
                                                spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1300
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU5' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                        spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1300
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MU6' + spawn.name, {
                            working: false,
                            role: 'massUpgrader'
                        });
                    }
                }

            }
            if(spawn.room.terminal && spawn.room.find(FIND_MINERALS)[0].mineralAmount > 0){
                console.log(spawn+ " needs to do mineral stuff");
                spawn.createCreep(
                        [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, //1700
                            CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE], 'MC1' + spawn.name, {
                            working: false,
                            role: 'mineralCollector'
                        });
            }
        }



        var elapsed = Game.cpu.getUsed() - spawn.memory.startCpu;
        CPU.run(spawn, elapsed);


    }

};

