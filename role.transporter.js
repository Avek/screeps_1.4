var CPU = require('function.CPUmonitor');
var roleDistributor = require('role.distributor');

module.exports = {
    run: function(creep) {

        var startCpu = Game.cpu.getUsed();
        if(Game.cpu.bucket<-100){
            var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
            creep.say("Break...");
            CPU.run(creep, elapsed);
            return;
        }
        if(!creep.memory.containers){
            var containers = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.pos.findInRange(FIND_SOURCES, 1).length > 0)
            });
            containers.sort(function(a,b){return b.store[RESOURCE_ENERGY] - a.store[RESOURCE_ENERGY]});
            
            creep.memory.containers = {};
            for (var i in containers) {
                creep.memory.containers[i] = containers[i].id;
            }
        }
        if(!creep.memory.ammoboxes){
            var ammoboxes = creep.room.find(FIND_STRUCTURES, {
                filter: (s) => (s.structureType == STRUCTURE_CONTAINER && s.pos.findInRange(FIND_MY_STRUCTURES, 1, {filter: (s) => (s.structureType == STRUCTURE_TOWER)}).length > 0)
            });
            creep.memory.ammoboxes = {};
            for (var i in ammoboxes) {
                creep.memory.ammoboxes[i] = ammoboxes[i].id;
            }
        }
        if(!creep.memory.storage){
            if(creep.room.storage)
                creep.memory.storage = creep.room.storage.id;
            else
                creep.memory.storage = 'none';
        }

        try{
            //if no container is defined or the container in memory is empty...
            if(!creep.memory.container || Game.getObjectById(creep.memory.container).store[RESOURCE_ENERGY] == 0) {
                if(creep.memory.containers.length == 0){
                    creep.memory.scavenger = true;
                }
                for (var i in creep.memory.containers) {
                    //console.log(creep.name + " observers " + Game.getObjectById(creep.memory.containers[i]).energy + " left in container " + creep.memory.containers[i])
                    if (Game.getObjectById(creep.memory.containers[i]).store[RESOURCE_ENERGY] > 0) {
                        creep.memory.container = creep.memory.containers[i];
                        break;
                    }
                }
            }
            //if no ammobox is defined or the ammobox is full...
            if(!creep.memory.ammobox || Game.getObjectById(creep.memory.ammobox).store[RESOURCE_ENERGY] == Game.getObjectById(creep.memory.ammobox).storeCapacity) {
                for (var i in creep.memory.ammoboxes) {
                    //console.log(creep.name + " observers " + Game.getObjectById(creep.memory.containers[i]).energy + " left in container " + creep.memory.containers[i])
                    if (Game.getObjectById(creep.memory.containers[i]).store[RESOURCE_ENERGY] < Game.getObjectById(creep.memory.containers[i]).storeCapacity) {
                        creep.memory.ammobox = creep.memory.ammoboxes[i];
                        break;
                    }
                }
            }
        }catch(e){//console.log("Transporter script issue: "+creep.name + " " +e);
             }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;

        //creep is out of energy
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
            delete creep.memory.containers;
            delete creep.memory.container;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity)
        {
            creep.memory.working = true;
        }

        //creep is working transfer energy
        if (creep.memory.working == true) {
            
            if(creep.room.storage && creep.room.storage.store.energy == creep.room.storage.storeCapacity){
                creep.say("break time...");
                return;
            }
            
            var target = "";
            if(creep.memory.ammobox && Game.getObjectById(creep.memory.ammobox).store[RESOURCE_ENERGY] < Game.getObjectById(creep.memory.ammobox).storeCapacity){
                target = Game.getObjectById(creep.memory.ammobox);
            }else if(creep.memory.storage) {
                target = Game.getObjectById(creep.memory.storage);
            }
            if (!target) {
                roleDistributor.run(creep);
                var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
                CPU.run(creep, elapsed);
                return;
            }
            creep.memory.target = target;
            var ret = creep.transfer(target, RESOURCE_ENERGY);
            creep.say("ret = " + ret);
            if (ret == ERR_NOT_IN_RANGE) {
                if(creep.memory.target && !creep.memory.path){
                    creep.say("PATHING!");
                    creep.memory.path = Room.serializePath(creep.pos.findPathTo(creep.memory.target), {ignoreCreeps: true});
                }
                creep.moveByPath(creep.memory.path);
            }else if(ret == OK || ret == ERR_FULL){
                delete creep.memory.target;
                delete creep.memory.path;
            }
            console.log(creep.name + " working: "+elapsed);
        }
        else {
                if(creep.memory.container){
                    var target = Game.getObjectById(creep.memory.container);
                    if (target) {
                        var ret = creep.withdraw(target, RESOURCE_ENERGY);

                        if(ret == ERR_NOT_IN_RANGE){
                            if(!creep.memory.path)
                                creep.say("PATHING!");
                                creep.memory.path = Room.serializePath(creep.pos.findPathTo(target), {ignoreCreeps: true});
                            creep.moveByPath(creep.memory.path);
                        }else{
                            delete creep.memory.path;
                        }
                    }
                }
            else{
                    var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY);
                    creep.pickup(target);
                }
        }
        var elapsed = Game.cpu.getUsed() - creep.memory.startCpu;
        CPU.run(creep, elapsed);
    }
};