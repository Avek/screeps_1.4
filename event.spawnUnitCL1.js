/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.spawnUnit');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(spawn, units, assist) {
        var enemies = spawn.room.find(FIND_HOSTILE_CREEPS, {filter: (e) => (e.owner.username != "Momo")}).length;
        assist = assist || 0;
        
        if(spawn.room.energyCapacityAvailable < 550 || _.sum(Game.creeps, (c) => c.memory.role != undefined && c.room.name == spawn.room.name) == 0) { //300 is max
        
            for(var i = 0; i<units; i++){
                spawn.createCreep([WORK, WORK, CARRY, MOVE], 'CON'+'_'+i+'_'+spawn.name, {
                    role: 'worker',
                    working: false
                }); //300
            }
            for(var i = 0; i<assist; i++){
                spawn.createCreep([WORK, WORK, CARRY, MOVE], 'AS'+'_'+i+'_'+spawn.name, {
                    role: 'base', 
                    subrole: 'worker',
                    explorer: true,
                    waypoint: true,
                    working: false
                }); //300
            }
            
            if (enemies > 0) {
                spawn.createCreep([TOUGH, MOVE, ATTACK, ATTACK, ATTACK], 'SEN998'+spawn.name, {role:'sentry', working:false}); //300
            }
        }else if(spawn.room.energyCapacityAvailable < 800) { //550 is max
        
        for(var i = 0; i<units; i++){
            spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'CON'+'_'+i+'_'+spawn.name, {
                role: 'worker', 
                working: false
            }); //550
        }
        for(var i = 0; i<assist; i++){
            spawn.createCreep([WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE], 'AS'+'_'+i+'_'+spawn.name, {
                role: 'base', 
                subrole: 'worker',
                explorer: true,
                waypoint: true,
                working: false
            }); //550
        }
            if (enemies > 0) {
                spawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], 'SEN998'+spawn.name, {role:'sentry', working:false}); //500
            }
        }else if(spawn.room.energyCapacityAvailable < 1300) { //800 is max
            for(var i = 0; i<units; i++){
                spawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'CON'+'_'+i+'_'+spawn.name, {
                    role: 'worker',
                    working: false
                }); //800
            }
            for(var i = 0; i<assist; i++){
                spawn.createCreep([WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE], 'AS'+'_'+i+'_'+spawn.name, {
                    role: 'base', 
                    subrole: 'worker',
                    explorer: true,
                    waypoint: true,
                    working: false
                }); //800
            }

            if(Game.time > 14841623 && Game.time <  14850906)
                spawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], 'VIKING00'+Math.floor((Math.random() * 100) + 1), {role:'viking', viking:true, working:false}); //760



            if (enemies > 0) {
                spawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], 'SEN998', {role:'sentry', working:false}); //500
            }
        }else if(true || spawn.room.energyCapacityAvailable < 1900) { //1300 is max
        for(var i = 0; i<units; i++){
            spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'CON'+'_'+i+'_'+spawn.name, {
                role: 'worker',
                working: false
            }); //1300
        }
        for(var i = 0; i<assist; i++){
            var ret = spawn.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'AS'+'_'+i+'_'+spawn.name, {
                role: 'base',
                subrole: 'worker',
                explorer: true,
                waypoint: true,
                working: false
            }); //1300
            console.log("Assist: "+ret);
        }


/*            if(false && Game.time > 14841623 && Game.time <  14850906)
                spawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], 'VIKING00'+Math.floor((Math.random() * 100) + 1), {role:'viking', viking:true, working:false}); //760

            if (spawn.room.find(FIND_HOSTILE_CREEPS).length > 0) {
                spawn.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, MOVE, ATTACK, ATTACK, ATTACK, ATTACK], 'SEN998', {role:'sentry', working:false}); //500
            }*/
        }
    }
};
