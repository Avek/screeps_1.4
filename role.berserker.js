/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.berserker');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        // creep.moveTo(49, 41);
        //return;
        /*        if (creep.room.name == 'W14Sadzxc48') {
         creep.moveTo(49, 41);
         return;
         }else if (creep.room.name == 'W13S48') {
         console.log("well here i am");
         creep.moveTo(5, 49);
         return;
         }else if (creep.room.name == 'W13S49') {
         //creep.moveTo(43, 13);
         //creep.moveTo(49, 11);
         //var kill = Game.getObjectById('57845b9015d4809e52390dc1');
         //creep.attack(kill);
         //creep.moveTo(kill);
         return;
         }else if (creep.room.name == 'W12S49') {
         creep.moveTo(39, 0);
         return;
         }*/
        // var kill = Game.getObjectById('57845b9015d4809e52390dc1');
        // creep.attack(kill);
        // creep.moveTo(kill);
        //creep.moveTo(40, 45);
        //return;
        var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemy_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemy_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        //var walls= creep.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_WALL}});
        //walls[0]="57804f736fe410c427084baf";
        //console.log(creep.attack(enemies[0]));
        //console.log("berserkers active");
        if (false && enemies != undefined) {
            if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {
                creep.say("Die enemy!");
                creep.moveTo(enemies);
            }
        } else if (enemy_spawn != undefined) {
            if (creep.attack(enemy_spawn) == ERR_NOT_IN_RANGE) {
                creep.say("Die spawn!");
                creep.moveTo(enemy_spawn);
            }
        } else if (enemy_structures != undefined) {
            if (creep.attack(enemy_structures) == ERR_NOT_IN_RANGE) {
                creep.say("Die structure!");
                creep.moveTo(enemy_structures);
            }
        }
    }
};