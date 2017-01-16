var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {
        // creep.moveTo(49, 41);
        //return;

        // var kill = Game.getObjectById('57845b9015d4809e52390dc1');
        // creep.attack(kill);
        // creep.moveTo(kill);
        //creep.drop(RESOURCE_ENERGY);
/*                        creep.moveTo(35, 7);
         return;*/
        var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemy_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemy_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);
        var neutral_controller = creep.room.controller;

        var targetRoom = "W41S26";

        if(!creep.pos.inRangeTo(Game.flags.CLAIM1, 1)){
            creep.moveTo(Game.flags.CLAIM1);
            return;
        }else if (creep.room.controller) {
            //creep.say("controller!!");
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            return;
        }

        if (creep.room.name != targetRoom) {

            //console.log(creep.name+" thinks he is in room "+creep.room.name+" == "+targetRoom+"evals to "+(creep.room.name == targetRoom));

            if(creep.room.name == "W42S26"){
                //console.log(creep.name + " I'm in room "+ creep.room.name+" moving to "+ Game.flags.Flag1);
                creep.moveTo(Game.flags.Flag1, {reusePath: 50});
                return;
            }
            if(creep.room.name == "W41S26"){
                //console.log(creep.name + " I'm in room "+ creep.room.name+" moving to "+ Game.flags.Flag2);
                creep.moveTo(Game.flags.Flag2, {reusePath: 50});
                return;
            }
            if(creep.room.name == "W41S27"){
                //console.log(creep.name + " I'm in room "+ creep.room.name+" moving to "+ Game.flags.Flag3);
                if(creep.pos.isEqualTo(Game.flags.Flag2aa.pos)){
                    console.log("BINGO");
                    creep.memory.destination=Game.flags.Flag2a;

                }if(creep.pos.isEqualTo(Game.flags.Flag2a.pos)){
                    console.log("BINGO");
                    creep.memory.destination=Game.flags.Flag2b;

                }if(creep.pos.isEqualTo(Game.flags.Flag2b.pos)){
                    console.log("BINGO");
                    creep.memory.destination=Game.flags.Flag2c;

                }if(creep.pos.isEqualTo(Game.flags.Flag2c.pos)){
                    console.log("BINGO");
                    creep.memory.destination=Game.flags.Flag3;

                }
                    //console.log(creep.pos+" PROBLEMS PATHING ");//+Game.flags.Flag2aa.pos);
                //console.log(creep.name+" looking for "+creep.memory.destination.pos.x);
                //console.log(creep.name+" moving: "+creep.moveTo(creep.memory.destination.pos.x,creep.memory.destination.pos.y));
                creep.moveTo(creep.memory.destination.pos.x,creep.memory.destination.pos.y);
                //creep.moveTo(Game.flags.Flag3, {reusePath: 50});
                return;
            }




   /*         var route = Game.map.findRoute(creep.room, targetRoom);
            if (route.length > 0) {
                      // console.log(creep.name +' now heading to room '+ path.room.exit);
                //console.log(creep.name +' now heading to room ' + route[0].room);

                var exit = creep.pos.findClosestByRange(route[0].exit);
                creep.moveTo(exit);
                return;
            }*/
        } else {

            //claim room
            if (creep.room.controller) {
                //creep.say("controller!!");
                if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }

            //build spawn
            if (creep.memory.working == true && creep.carry.energy == 0) {
                //console.log(creep.name + " is going back to source. ");
                creep.memory.working = false;

            }// creep cannot carry any more energy
            else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
                creep.memory.working = true;
                //console.log(creep.name + " is going back to spawn. ");
            }

            if (creep.memory.working == true) {
                var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
                if (constructionSite != undefined) {
                    if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(constructionSite);
                    }
                } else {
                    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            }else {
                var source = creep.room.find(FIND_SOURCES)[0];
                //console.log(creep.name+" is looking for "+source);
                var retval = creep.harvest(source);
                if (retval == ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
            }
        }
    }
};