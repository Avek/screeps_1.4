var roleUpgrader = require('role.upgrader');
var roleConstructor = require('role.constructor');
var roleCollector = require('role.collector');
var roleMineralCollector = require('role.mineralCollector');
var roleTransporter = require('role.transporter');
var roleSentry = require('role.sentry');
var roleExtTransporter = require('role.extTransporter');
var roleExtCollector = require('role.extCollector');
var roleExtUpgrader = require('role.extUpgrader');
var roleExtConstructor = require('role.extConstructor');
var roleLinker = require('role.linker');
var roleBase = require('role.base');
var roleClaimer = require('role.claimer');
var roleDistributor = require('role.distributor');
var roleMassUpgrader = require('role.massUpgrader');
var roleBroker = require('role.broker');
var roleWorker = require('role.worker');
var roleGunner = require('role.gunner');
var rolePaladin = require('role.paladin');
var roleRogue = require('role.rogue');
var roleHelper = require('role.helper');
var roleTank = require('role.tank');
var roleCleaner = require('role.cleaner');
var rolePhalanx = require('role.phalanx');

//var harvester = require('role.harvester');

var roleHealer = require('role.healer');
var roleViking = require('role.viking');

var CPU = require('function.CPUmonitor');



/****************CONSTANTS******************************/
var RAMPART_HITS = 200000;
var WALL_HITS = 50000;
var CONTAINER_HITS = 50000;
var ROAD_HITS = 4000;
var WHITELIST = ["undefined", "Momo", "Xentrox", "Boaras"];
var SAFEMODE_WHITELIST = ["undefined", "Momo", "Xentrox", "Boaras", "Invader"];


module.exports = {
    run: function() {

        var creepCpu = Game.cpu.getUsed();
        for (let name in Game.creeps) {


            var creep = Game.creeps[name];

            var startCpu = Game.cpu.getUsed();

            //move to flag that has the creep's name, delete flag when location reached
            if(Game.flags[creep.name]){
                creep.moveTo(Game.flags[creep.name]);
                if(creep.pos.inRangeTo(Game.flags[creep.name], 1)){
                    Game.flags[creep.name].remove();
                }
                continue;
            }
            //if(creep.name.match(/WARRIOR1.*/)){
           //     creep.memory.role = '';
            //    creep.say(creep.move(LEFT, {ignoreDestructibleStructures: true}));
            //    continue;
            //    creep.memory.guard = 'RALLY';
            //}
            creep.memory.startCpu = startCpu;

  /*          if(creep.room.name == "W42S27" || creep.room.name == "W41S23" || creep.room.name == "W42S28" ){
                creep.say("Paused...");
                continue;
            }*/

/*            //safemode
            if(_.sum(Game.creeps, (c) => c.memory.role != undefined) < 4) {
                roleBase.run(creep);
            }*/
            if(creep.ticksToLive == 2){
                creep.say("blargh!");
                creep.drop(RESOURCE_ENERGY);
            }

            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
                //var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 2);
                //creep.pickup(target);
            }

            if (creep.memory.role == 'constructor') {
                roleConstructor.run(creep);
                //var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 2);
                //creep.pickup(target);
            }

            /*if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }*/

            if (creep.memory.role == 'collector') {
                roleCollector.run(creep);
            }

            if (creep.memory.role == 'mineralCollector') {
                roleMineralCollector.run(creep);
            }

            if (creep.memory.role == 'transporter') {
                roleTransporter.run(creep);
            }

            if (creep.memory.role == 'sentry') {
                roleSentry.run(creep);
            }

            if (creep.memory.role == 'extTransporter') {
                roleExtTransporter.run(creep);
            }

            if (creep.memory.role == 'extCollector') {
                roleExtCollector.run(creep);
            }
            
            if (creep.memory.role == 'extConstructor') {
                roleExtConstructor.run(creep);
            }
            
            
            if (creep.memory.role == 'extUpgrader') {
                roleExtUpgrader.run(creep);
            }

            if (creep.memory.role == 'linker') {
                roleLinker.run(creep);
            }

            if (creep.memory.role == 'claimer') {
                roleClaimer.run(creep);
            }

            if (creep.memory.role == 'distributor') {
                roleDistributor.run(creep);
            }

            if (creep.memory.role == 'massUpgrader') {
                roleMassUpgrader.run(creep);
            }

            if (creep.memory.role == 'base') {
                roleBase.run(creep);
            }

            if (creep.memory.role == 'viking') {
                //roleBase.run(creep);
            }


            if (creep.memory.role == 'healer') {
                roleHealer.run(creep);
            }

            if (creep.memory.role == 'viking') {
                roleViking.run(creep);
            }            
            
            if (creep.memory.role == 'broker') {
                roleBroker.run(creep);
            }

            if (creep.memory.role == 'worker') {
                roleWorker.run(creep);
            }

            if (creep.memory.role == 'gunner') {
                roleGunner.run(creep);
            }

            if (creep.memory.role == 'paladin') {
                rolePaladin.run(creep);
            }

            if (creep.memory.role == 'rogue') {
                roleRogue.run(creep);
            }

            if (creep.memory.role == 'helper') {
                roleHelper.run(creep);
            }

            if (creep.memory.role == 'tank') {
                roleTank.run(creep);
            }
            
            if (creep.memory.role == 'cleaner') {
                roleCleaner.run(creep);
            }
                        
            if (creep.memory.role == 'phalanx') {
                rolePhalanx.run(creep);
            }

        }

        var elapsed = Game.cpu.getUsed() - creepCpu;
        console.log('Creeps: '+elapsed+' CPU time');
        /*var elapsed = Game.cpu.getUsed() - startCpu;
        if(Memory.SHOWCPU)
            if(elapsed>Memory.SHOWCPUTHRESHOLD)
                console.log('Creep '+creep.name+' has used '+elapsed+' CPU time');*/

        var calcNextSpawnCPU = Game.cpu.getUsed();
        //for each room for each tower do the tower stuff
        for (let name in Game.spawns) {
            var spawn = Game.spawns[name];

            //var startCpu123 = Game.cpu.getUsed();
            //trigger safemode
            if(spawn.pos.findInRange(FIND_HOSTILE_CREEPS, 1, {filter: (e) => (!SAFEMODE_WHITELIST.includes(e.owner.username))}).length > 0){
                console.log("<h1> ENEMY DETECTED NEXT TO SPAWN</h1>");
                Game.notify("<h1> ENEMY DETECTED NEXT TO SPAWN</h1>");
                spawn.room.controller.activateSafeMode();
            }

            // countCPU = Game.cpu.getUsed() - startCpu123;
            //console.log("Cost for scan: "+countCPU );
            //refresh towers in spawn memory every once in a while

            if(Game.time%100 == 0) {
                console.log(spawn.name+"Refreshing towers in spawn memory...");
                delete spawn.memory.towers;
            }

            if(!spawn.memory.towers) {
                var initTowers = spawn.room.find(FIND_MY_STRUCTURES, {
                    filter: (s) => s.structureType == STRUCTURE_TOWER
                });
                console.log(spawn.name+" is initializing tower memory..."+initTowers.length);
                spawn.memory.towers = [];
                for (var i in initTowers) {
                    spawn.memory.towers[i] = initTowers[i].id;
                }
            }
            var towers = spawn.memory.towers;
            try {
                if(Memory.towerRange){
                    var target = Game.getObjectById(towers[0]).pos.findClosestByRange(FIND_HOSTILE_CREEPS, {filter: (e) => (!WHITELIST.includes(e.owner.username))});
                }else{
                    var target = Game.getObjectById(towers[0]).pos.findInRange(FIND_HOSTILE_CREEPS, 23, {filter: (e) => (!WHITELIST.includes(e.owner.username))})[0];
                }
                //target = null;
            }catch(e){
                console.log("Error: "+e);
                console.log("Most likely no tower in room");
            }
            if (target != undefined) {
                var tower;
                for (let i in towers) {
                    tower = Game.getObjectById(spawn.memory.towers[i]);
                    console.log("tower: "+tower);

                    /*if (tower.room.name == "W41S23")
                        continue;*/
                    tower.attack(target);
                }
            } else
            {//reserve shots for baddies!
                try{
                var firstTower = Game.getObjectById(towers[0]);
                    //console.log(spawn.room.name + " looking for first tower: "+firstTower);
                    if(!firstTower){
                        continue;
                    }
                var flag = _.find(firstTower.room.find(FIND_FLAGS), (s) => (s.name.match(/DIS_END.*/)));

                //console.log(flag);
                var structure = Game.getObjectById(towers[0]).pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => s.hits < ROAD_HITS && s.structureType == STRUCTURE_ROAD
                });
                }catch(e){
                    console.log("Error: "+e.stack);
                    console.log("Most likely no flags for distributors or towers");
                    continue;
                }
                if(structure == undefined){
                    var structure = Game.getObjectById(towers[0]).pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: (s) => s.hits < RAMPART_HITS && s.structureType == STRUCTURE_RAMPART
                    }, 2);
                    if(structure == undefined){
                        var structure = Game.getObjectById(towers[0]).pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (s) => s.hits < WALL_HITS && s.structureType == STRUCTURE_WALL
                            && !s.pos.inRangeTo(_.find(flag.room.find(FIND_FLAGS), (s2) => (s2.name.match(/DIS_END.*/))), 1)
                        }, 2);
                    }
                }if(structure == undefined){
                    var structure = Game.getObjectById(towers[0]).pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => s.hits < CONTAINER_HITS && s.structureType == STRUCTURE_CONTAINER
                    }, 2);
                }
                if(structure) {
                    try {
                        for (let i in towers) {
                            tower = Game.getObjectById(spawn.memory.towers[i]);
                            var startCpu = Game.cpu.getUsed();
                            if (tower.energy > 400) {
                                tower.repair(structure);
                            }
                            //console.log("repairing "+ structure+": "+tower.repair(structure));
                            var elapsed = Game.cpu.getUsed() - startCpu;
                            var towerName = "TWR" + tower.id.substr(tower.id.length - 5);
                            CPU.run(tower, elapsed, towerName);
                        }
                    }catch(e){delete spawn.memory.towers;}
                }
            }
        }
        var calcNextSpawnelapsed = Game.cpu.getUsed() - calcNextSpawnCPU;
        console.log("Tower loops: "+calcNextSpawnelapsed+ " CPU ");

        var linkCpu = Game.cpu.getUsed();
        /*//first room
        var linkIn = Game.getObjectById("579eb08f3bd4b218529fe5a5"); //first border in
        var linkOut = Game.getObjectById("579ef0a2c28034db595b4910"); //storage
        if(linkIn.energy > 0){
            linkIn.transferEnergy(linkOut);
        }
        var linkIn = Game.getObjectById("57a93b13d69deeb11959ddbf"); //second border in
        var linkOut = Game.getObjectById("579ef0a2c28034db595b4910"); //storage
        if(linkIn.energy == linkIn.energyCapacity){
            console.log(linkIn.transferEnergy(linkOut, 600)+ " link out");
        }
        //second room
        var linkIn = Game.getObjectById("57a675210db095f25fa14244");
        var linkOut = Game.getObjectById("57a7fd62b9cb3bd921a2663a");
        if(linkIn.energy > 0){
            linkIn.transferEnergy(linkOut);
        }
        */
        //57dd9b02bd5a61201057b9ab

        var elapsed = Game.cpu.getUsed() - linkCpu;

        CPU.run(undefined, elapsed, "LINKS");
    }
};