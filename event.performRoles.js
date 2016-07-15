var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleConstructor = require('role.constructor');
var roleBerserker = require('role.berserker');
var roleRepairer = require('role.repairer');
var roleCollector = require('role.collector');
var roleTransporter = require('role.transporter');
var roleSentry = require('role.sentry');
var roleBase = require('role.base');

module.exports = {
    run: function() {

        for (let name in Game.creeps) {



            var creep = Game.creeps[name];
            //console.log(creep.name);

            //sound-off
            if(creep.memory.role == 'transporter'){
                creep.say(creep.memory.group);
            }

            //safemode
            if(_.sum(Game.creeps, (c) => c.memory.role != undefined) < 4) {
                roleBase.run(creep);
            }
            if(creep.ticksToLive == 2){
                creep.say("Good-bye cruel world!!!");
                creep.drop(RESOURCE_ENERGY);
            }

            if (creep.memory.role == 'harvester') {
                roleHarvester.run(creep);
            }

            if (creep.memory.role == 'upgrader') {
                roleUpgrader.run(creep);
            }

            if (creep.memory.role == 'constructor') {
                roleConstructor.run(creep);
            }

            if (creep.memory.role == 'berserker') {
                roleBerserker.run(creep);
            }

            if (creep.memory.role == 'repairer') {
                roleRepairer.run(creep);
            }

            if (creep.memory.role == 'collector') {
                roleCollector.run(creep);
            }

            if (creep.memory.role == 'transporter') {
                roleTransporter.run(creep);
                var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                if(target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                }
            }

            if (creep.memory.role == 'sentry') {
                roleSentry.run(creep);
            }
        }
        var towers = Game.rooms.W44N32.find(FIND_STRUCTURES, {
            filter: (s) => s.structureType == STRUCTURE_TOWER
        });
        for (let tower of towers) {
            var target = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

            if (target != undefined) {
                tower.attack(target);
            } else if(tower.energy > 500){ //reserve shots for baddies!

                var structure = creep.pos.findClosestByPath(FIND_STRUCTURES, {
                    filter: (s) => s.hits < 10000 && s.structureType == STRUCTURE_RAMPART
                });

            }
                
            
        }
    }
};