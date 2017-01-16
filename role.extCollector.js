var roleCollector = require('role.collector');

module.exports = {

    run: function(creep) {
    
        if(!creep.memory.mine){
            console.log(creep.name+" was not initialized with a mining target! add \"Game.creeps."+creep.name+".memory.mine=\'room.name\'\"");
            return;
        }

        var mine = creep.memory.mine;



                //creep is out of energy
        if (creep.memory.working == true && _.sum(creep.carry) == 0) {
            creep.memory.working = false;
        }// creep cannot carry any more energy
        else if (creep.memory.working == false && _.sum(creep.carry) == creep.carryCapacity)
        {
            creep.memory.working = true;
        }


        if(!creep.pos.inRangeTo(Game.flags[mine], 0)){
            creep.moveTo(Game.flags[mine]);
            return;
        }else{
            if(!creep.memory.source){
                creep.memory.source = creep.pos.findInRange(FIND_SOURCES, 1)[0].id;
            }
            if(!creep.memory.tower){
                creep.memory.tower = creep.pos.findInRange(FIND_STRUCTURES, 1, { filter: (s) => (s.structureType=='tower')})[0].id;
            }
            if(!creep.memory.spawn){
                creep.memory.spawn = creep.pos.findInRange(FIND_MY_SPAWNS, 1)[0].id;
            }
            var source = Game.getObjectById(creep.memory.source);
            var tower = Game.getObjectById(creep.memory.tower);
            var spawn = Game.getObjectById(creep.memory.spawn);

            creep.harvest(source);
            if(tower.energyCapacity-tower.energy > spawn.energyCapacity-spawn.energy){
                creep.say('T:'+creep.transfer(tower, RESOURCE_ENERGY));
            }else{
                creep.say('S:'+creep.transfer(spawn, RESOURCE_ENERGY));
            }
        }


    }
};