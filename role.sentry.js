var roleTransporter = require('role.transporter');
var CPU = require('function.CPUmonitor');

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


        var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (e) => (e.owner.username != "Momo")});
        var enemy_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemy_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);

try {
    if (!creep.memory.area) {
/*        if (creep.room.name == "W42S26") {
            creep.memory.area = "W42S26";
        }
        if (creep.room.name == "W42S27") {
            creep.memory.area = "W42S27";
        }
        if (creep.room.name == "W41S23") {
            creep.memory.area = "W41S23";
        }*/
        creep.memory.area = creep.room.name;
    }
    //console.log(creep.name + " looking for sources " + Game.rooms.W43S26.find(FIND_SOURCES).length);
    //define room to go to
    //TODO: unhardcode this crap
/*    if (!creep.memory.area) {
        if (creep.room.name == "W42S26") {
            if (_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W43S26")
                < 2) {
                creep.memory.area = "W43S26";
            } else if (_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W41S26")
                < 1) {
                creep.memory.area = "W41S26";
            } else if (_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W42S26")
                < 1) {
                creep.memory.area = "W42S26";
            }
        } else if (creep.room.name == "W42S27") {
            if (_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W41S27")
                < 1) {
                creep.memory.area = "W41S27";
            } else if (_.sum(Game.creeps, (c) => c.memory.role == 'sentry' && c.memory.area == "W42S27")
                < 1) {
                creep.memory.area = "W42S27";
            }
        }
    }*/
}catch(e){console.log("sentry throws: "+e);}
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
                creep.say("huff..");
                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
                return;
            }
        }
        if (enemy_spawn != undefined) {
            if (creep.attack(enemy_spawn) == ERR_NOT_IN_RANGE) {
                creep.say("Die enemy_spawn!");
                creep.moveTo(enemy_spawn);
            }
        } else if (enemies != undefined) {
            creep.say("Die enemy!");
            if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {

                creep.moveTo(enemies);
                for (let part in enemies.body)
                    if(part.type == 'heal')
                        var heal = true;
                if(heal)
                    try{
                        Game.notify('Intruder: '+ enemies.owner.username + ' has sent unit(s) to '+creep.room+' at ' + game.time +' ticks, creep contains '+creep.body.length +' body parts');
                    }catch(e){ console.log(e.stack);}
                else if(enemies.owner && enemies.owner.username != 'Invader'){
                    try{
                        Game.notify('Intruder: '+ enemies.owner.username + ' has sent unit(s) to '+creep.room+' at ' + game.time +' ticks, creep contains '+creep.body.length +' body parts');
                    }catch(e){ console.log(e.stack);}
                    console.log('<h1><font color=\"red\"> HOSTILE UNITS DETECTED </font></h1>');
                }else
                    console.log('Creep '+creep.name+' has found an enemy '+ enemies.name +' at '+creep.pos+'!');
            }
        } else if (enemy_structures != undefined && enemy_structures.structureType != 'keeperLair') {
            creep.say("Die struct!");
            if (creep.attack(enemy_structures) == ERR_NOT_IN_RANGE) {
                creep.moveTo(enemy_structures);
            }
        } else if(creep.memory.sk_buster) {
            creep.say("iooioi!");
            creep.heal(creep);
        } else {
            //stand by tower
            creep.say("zzzzz...");
            var ramparts = creep.room.find(FIND_MY_STRUCTURES, {
                filter: (s) => s.structureType == STRUCTURE_RAMPART
            });
            if(true || ramparts[0]==undefined){
                if(!creep.pos.inRangeTo(creep.room.controller, 1))
                    creep.moveTo(creep.room.controller);
            }else
            if(!creep.pos.inRangeTo(ramparts[0], 2))
                creep.moveTo(ramparts[0]);
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    }
};