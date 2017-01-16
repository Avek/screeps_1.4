var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {
        // creep.moveTo(49, 41);
        //return;

        // var kill = Game.getObjectById('57845b9015d4809e52390dc1');
        // creep.attack(kill);
        // creep.moveTo(kill);
        //creep.drop(RESOURCE_ENERGY);
        /*        creep.moveTo(3, 16);
         return;*/


        var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemy_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemy_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);

        //define room to go to
        if(!creep.memory.area){
            if(creep.room.name == "W42S26"){
                if(_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W43S26")
                    < Game.rooms["W43S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W43S26";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W41S26")
                    < Game.rooms["W41S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W41S26";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W42S26")
                    < Game.rooms["W42S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W42S26";
                }
            }else if(creep.room.name == "W42S27"){
                if(_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W41S27")
                    < Game.rooms["W41S27"].find(FIND_SOURCES).length){
                    creep.memory.area = "W41S27";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W42S27")
                    < Game.rooms["W42S27"].find(FIND_SOURCES).length){
                    creep.memory.area = "W42S27";
                }
            }
        }

        //reassign to outer rooms
     /*   if(creep.memory.area == "W42S26" && _.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W43S26") == 0 )
            creep.memory.area = "W43S26";
        else if (creep.memory.area == "W42S26" && _.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W41S26") == 0 )
            creep.memory.area = "W43S26";
        else if (creep.memory.area == "W42S27" && _.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W41S27") == 0 )
            creep.memory.area = "W41S27";
*/



            var targetRoom = creep.memory.area;//"W42S26";
        if (creep.room != targetRoom && enemies == undefined) {
            var route = Game.map.findRoute(creep.room, targetRoom);
            if (route.length > 0) {
                console.log(creep.name+'Now heading to room ' + route[0].room);
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
                return;
            }
        }
        if (enemy_spawn != undefined) {
            if (creep.attack(enemy_spawn) == ERR_NOT_IN_RANGE) {
                //creep.say("Die enemy_spawn!");
                creep.moveTo(enemy_spawn);
            }
        } else if (enemies != undefined) {
            if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {
                creep.say("Die enemy!");
                creep.moveTo(enemies);
                Game.notify('Creep '+creep.name+' has found an enemy '+ enemies.name +' at '+creep.pos+'!');
            }
        } else if (enemy_structures != undefined) {
            if (creep.attack(enemy_structures) == ERR_NOT_IN_RANGE) {
                //creep.say("Die struct!");
                creep.moveTo(enemy_structures);
            }
        }

        /*            creep.say("covering transporters");
         if(creep.memory.group == undefined){
         var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
         if(groupRatio){
         creep.memory.group= 'beta';
         }else
         creep.memory.group= 'alpha';
         }
         roleTransporter.run(creep);*/
     else {
            //stand by tower

            var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_RAMPART
            });
            if(ramparts[0]==undefined){
                if(!creep.pos.inRangeTo(creep.room.controller, 5))
                    creep.moveTo(creep.room.controller);
            }else
                if(!creep.pos.inRangeTo(ramparts[0], 2))
                creep.moveTo(ramparts[0]);
        }
    }
};