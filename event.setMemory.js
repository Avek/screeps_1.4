/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.setMemory');
 * mod.thing == 'a thing'; // true
 */

var CPU = require('function.CPUmonitor');


module.exports = {

    run: function() {

        var startCpu = Game.cpu.getUsed();
    /*    if(Game.SOURCES == undefined){
            Game.SOURCES = [Game.spawns.Spawn1.room.find(FIND_SOURCES)[0],
                Game.spawns.Spawn1.room.find(FIND_SOURCES)[1]];
        }*/

        if(Memory.SATELLITES == undefined){
            Memory.SATELLITES = ["W43S26", "W41S26", "W41S27"];
        }

        if(Memory.DECEASED == undefined){
            Memory.DECEASED = ["", "", "", "", "", "", "", "", "", ""];
        }        
        
        if(Memory.CREEPCPU == undefined){
            Memory.CREEPCPU = ["", "", "", "", "", "", "", "", "", ""];
        }

/*        if(Game.creeps.TANK){
            Game.creeps.TANK.memory.role = 'base';
            Game.creeps.TANK.memory.subrole = 'tank';
            Game.creeps.TANK.memory.explorer = true;
            Game.creeps.TANK.memory.formation = 4;
        }
        if(Game.creeps.HEAL1){
            Game.creeps.HEAL1.memory.role = 'base';
            Game.creeps.HEAL1.memory.subrole = 'tankhealer';
            Game.creeps.HEAL1.memory.explorer = true;
            Game.creeps.HEAL1.memory.formation = 1;
        }
        if(Game.creeps.HEAL2){
            Game.creeps.HEAL2.memory.role = 'base';
            Game.creeps.HEAL2.memory.subrole = 'tankhealer';
            Game.creeps.HEAL2.memory.explorer = true;
            Game.creeps.HEAL2.memory.formation = 2;
        }
        if(Game.creeps.HEAL3){
            Game.creeps.HEAL3.memory.role = 'base';
            Game.creeps.HEAL3.memory.subrole = 'tankhealer';
            Game.creeps.HEAL3.memory.explorer = true;
            Game.creeps.HEAL3.memory.formation = 3;
        }*/

/*

        if(Game.creeps.TANK && Game.creeps.TANK.fatigue == 0){
            //Game.creeps.HEALER1.move(BOTTOM);
            Game.creeps.HEALER2.move(BOTTOM);
            Game.creeps.HEALER3.move(BOTTOM);
            Game.creeps.TANK.move(BOTTOM);
        }
*/
        //if(Game.time >  14850906)
            //Game.flags.RALLY.setPosition(new RoomPosition(15, 15, 'W63S63'));
        
        Memory.SHOWCPU = 1;
        Memory.SHOWCPUTHRESHOLD = 0.01;

        CPU.init();
        

        for(let name in Memory.creeps) {

            if (Game.creeps[name] == undefined) {
                /*console.log("@@@@@@@@@@@@@@@@@@@@@@@@Lost a :"+Memory.creeps[name].role+" @@@@@@@@@@@@@@@@@@@@@@@@@@");
                //room and role
                Memory.DECEASED.push([Memory.creeps.area, Memory.creeps[name].role]);
                Memory.DECEASED.shift();*/
                delete Memory.creeps[name];
            }
        }
        
        //switch for tower range every 100 ticks
        if(Memory.towerRange==undefined){
            Memory.towerRange=true;
        }else if(Game.time%100){
            if(Memory.towerRange==true){
                Memory.towerRange=false;
            }else{
                Memory.towerRange=true;
            }
        }


        /* Set attack squad info */
        Memory.SQUAD = 3; //who to heal
        Memory.MANUALHEAL = 1;

        try
        {
            Game.creeps.VIKING1.memory.role = 'viking';
            Game.creeps.HEALER1.memory.role = 'healer';
            Game.creeps.HEALER2.memory.role = 'healer';
            Game.creeps.HEALER3.memory.role = 'healer';
        }catch (e){}

        var elapsed = Game.cpu.getUsed() - startCpu;
        CPU.run(undefined, elapsed, "setMemory");

    }
};