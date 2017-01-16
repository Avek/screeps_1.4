var eventSpawnUnit = require('event.spawnUnit2.0');
var eventSpawnUnitCL1 = require('event.spawnUnitCL1');
var eventSetMemory = require('event.setMemory');
var eventPerformRoles = require('event.performRoles');
var eventOutpost = require('event.outpost');
var CPU = require('function.CPUmonitor');

module.exports.loop = function () {


    /* *******************************************************
     * *******************************************************
     * *******************************************************
     * ******************MANUAL INPUT BLOCK*******************
     * ********************KEEP CLEAR*************************
     * *******************************************************
     * *******************************************************
     */
     try{
        var spawnRooms = _.filter(Game.rooms, r => r.controller && r.controller.my);
        for(i in spawnRooms){
            var room = spawnRooms[i];
            console.log("DETECTED ROOM: " +room);
        }
     }catch(e){}
     
     //Game.spawns.Spawn1.createCreep([MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK], 'SIEGE'+Math.floor((Math.random() * 100) + 1), {role: 'viking',siege:true});
     /*
     	Game.spawns.Spawn1.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
	ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK],
'WARRIOR1_RA1', {role:'viking', guard:'RALLY1'}); //1100
*/

/*
     	Game.spawns.Spawn1.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
	ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL],
'WARRIOR1_RA1', {role:'base', subrole:'viking', explorer:true, waypoint:true, guard:'RALLY1'}); //1600
     	Game.spawns.Spawn1.createCreep([MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, 
	ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, ATTACK, HEAL],
'WARRIOR2_RA1', {role:'base', subrole:'viking', explorer:true, waypoint:true, guard:'RALLY1'}); //1600
*/
/*
*/
/*
Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, 
CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'CON04b', {role:'base', subrole:'worker', explorer:true, waypoint:true, working:false}); //1800
*/
/*
Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, 
CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'CON04c', {role:'base', subrole:'worker', explorer:true, waypoint:true, working:false}); //1800
Game.spawns.Spawn1.createCreep([WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, 
CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, 
MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE], 'CON04d', {role:'base', subrole:'worker', explorer:true, waypoint:true, working:false}); //1800

*/
 
 
 /*
 
    console.log("<h5><b><font color=\"lightblue\">"+ret+"</font></b></h5>");*/

    /* *******************************************************
     * *******************************************************
     * *******************************************************
     * ******************MANUAL INPUT BLOCK*******************
     * ********************KEEP CLEAR*************************
     * *******************************************************
     * *******************************************************
     */




    var startTotalCpu = Game.cpu.getUsed();

    var report = "CPU ITEMIZED-- "

    var memoryCpu = Game.cpu.getUsed();
    eventSetMemory.run();
    var elapsed = Game.cpu.getUsed() - memoryCpu;
    report += "Memory: " + elapsed + " ";

    var spawnCpu = Game.cpu.getUsed();
    try {
        
        if(true){// Game.spawns.Spawn1 && Game.spawns.Spawn1.room.mode != MODE_SIMULATION) {
            if(Game.spawns.Spawn1){
                //eventSpawnUnitCL1.run(Game.spawns.Spawn1, 8, 0);
                eventSpawnUnit.run(Game.spawns.Spawn1);
            }
            if(Game.spawns.Spawn2){
                eventOutpost.run(Game.spawns.Spawn2);
                //eventSpawnUnitCL1.run(Game.spawns.Spawn2, 5, 0);//eventSpawnUnit.run(Game.spawns.Spawn2);
            }
            if(Game.spawns.Spawn3){
                eventOutpost.run(Game.spawns.Spawn3);
                //eventSpawnUnitCL1.run(Game.spawns.Spawn3, 5, 0);
                //eventSpawnUnit.run(Game.spawns.Spawn3);//eventSpawnUnitCL1.run(Game.spawns.Spawn3, 5, 0);
            }
            if(Game.spawns.Spawn4){
                //eventSpawnUnit.run(Game.spawns.Spawn4);
            }
            if(Game.spawns.Spawn5){
                eventSpawnUnit.run(Game.spawns.Spawn5);
            }
        }else{//non simulation
            console.log("ASDFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
            eventPerformRoles.run();
            return;

        }

        var rolesCPU = Game.cpu.getUsed();
        eventPerformRoles.run();
        var elapsed = Game.cpu.getUsed() - rolesCPU;
        report += "Roles: " + elapsed + " ";
    }catch(e){console.log("<b><font color=\"red\">"+"ERROR: "+e.stack+"</font>");}

    var elapsed = Game.cpu.getUsed() - spawnCpu;

    report += "Spawns: " + elapsed + " ";

    console.log(report);

    CPU.report();
    var elapsed = Game.cpu.getUsed() - startTotalCpu;
    if(Memory.cpuQueue)
        Memory.cpuQueue.push(elapsed);
    CPU.heatmap(elapsed);
    if(elapsed > 9){
        elapsed = "<b><font color=\"red\">"+elapsed+"</font>";
    }else if(elapsed < 7){
        elapsed = "<b><font color=\"green\">"+elapsed+"</font>";
    }else{
        elapsed = "<b><font color=\"yellow\">"+elapsed+"</font>";
    }
    console.log('Main has used '+elapsed+' CPU time, bucket contains: '+ Game.cpu.bucket );

}