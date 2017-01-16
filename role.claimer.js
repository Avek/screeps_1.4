var CPU = require('function.CPUmonitor');

module.exports = {
    run: function(creep) {

        try {
            //unstick creep
            if (!creep.memory.stuck) {
                creep.memory.stuck = 0;
            }
            if (creep.memory.lastPosx && creep.memory.target) {
                //creep.say("stuck?");
                if (creep.fatigue == 0 &&
                    creep.memory.lastPosx == creep.pos.x && creep.memory.lastPosy == creep.pos.y &&
                    creep.memory.target.pos.x != creep.pos.x && creep.memory.target.pos.y != creep.pos.y) {
                    creep.memory.stuck = creep.memory.stuck + 1;
                    creep.say("stuck!!");
                }
                if (creep.memory.stuck > 5) {
                    creep.memory.stuck = 0;
                    delete creep.memory.path;
                }
            } else {
                creep.memory.lastPosx = creep.pos.x;
                creep.memory.lastPosy = creep.pos.y;
            }
        }catch(e){ console.log("Critical failure during the check stuck script for "+ creep.name + " : "+ e); }
        //checkStuck(creep);

        //edge of room, hold still to move by path into next room
        if(creep.pos.x == 0 || creep.pos.x == 49 || creep.pos.y == 0 || creep.pos.y == 49){
            delete creep.memory.path;
        }
        //define source and link to go to
        if(!creep.memory.claim) {
                if(creep.name == 'CLAIMER1') {
                    var found = 1;
                }else if(creep.name == 'Claimer3') {
                    var found = 3;
                }else if (creep.name == 'Claimer2') {
                    var found = 2;
                }else if (creep.name == 'Claimer4') {
                    var found = 4;
                }else if (creep.name == 'Claimer5') {
                    var found = 5;
                }else if (creep.name == 'Claimer7') {
                    var found = 7;
                }else if (creep.name == 'Claimer6') {
                    var found = 6;
                }
            if (found) {
                creep.memory.claim = found;
            }
        }
        if(!creep.memory.path && !creep.spawning) {


            switch (creep.memory.claim) {
                case 1:
                    creep.memory.target = Game.flags.CLAIM1;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                case 2:
                    creep.memory.target = Game.flags.CLAIM2;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                case 3:
                    creep.memory.target = Game.flags.CLAIM3;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                case 4:
                    creep.memory.target = Game.flags.CLAIM4;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                case 5:
                    creep.memory.target = Game.flags.CLAIM5;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                case 7:
                    creep.memory.target = Game.flags.CLAIM7;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                case 6:
                    creep.memory.target = Game.flags.CLAIM6;
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target));
                    break;
                default:
                    console.log("CLAIMERS ARE BREAKING LINE 38");
            }
        }
        //console.log(creep.name+" to target "+target+" "+creep.moveTo(target));
        if(creep.memory.subrole && creep.memory.subrole == 'reserver'){
            var ret = creep.reserveController(creep.room.controller);
            if (ret != 0) {
                console.log(creep.name + " tried to claim controller: "+ ret);
                var ret = creep.moveByPath(creep.memory.path);
                console.log(creep.name + " attempt to move by path: " + ret + " position is: " + creep.pos.x + ", " + creep.pos.y + " serialized path: " + creep.memory.path);
            }
        }else{
            var ret = creep.claimController(creep.room.controller);
            if (ret != 0) {
                console.log(creep.name + " tried to claim controller: "+ ret);
                var ret = creep.moveByPath(creep.memory.path);
                console.log(creep.name + " attempt to move by path: " + ret + " position is: " + creep.pos.x + ", " + creep.pos.y + " serialized path: " + creep.memory.path);
            }
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);

        /*if (!creep.pos.inRangeTo(target,1)) {
            creep.moveTo(target);
        }else if (creep.room.controller) {
            creep.say("wowowoo!");
            if (creep.name == 'Claimer5' && creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if (creep.name == 'Claimer7' && creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            if (creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
            return;
        }*/
    },
    checkStuck: function(creep) {
        //unstick creep
        if(!creep.memory.stuck){
            creep.memory.stuck = 0;
        }
        if(creep.memory.lastPosx){
            //creep.say("stuck?");
            if(creep.fatigue == 0 && creep.memory.lastPosx == creep.pos.x && creep.memory.lastPosy == creep.pos.y){
                creep.memory.stuck = creep.memory.stuck + 1;
                creep.say("stuck!!");
            }
            if(creep.memory.stuck > 5){
                creep.memory.stuck = 0;
                delete creep.memory.path;
            }
        }else {

            creep.memory.lastPosx = creep.pos.x;
            creep.memory.lastPosy = creep.pos.y;
        }
        return;
    }

};