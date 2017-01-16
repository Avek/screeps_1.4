/*
PHALANX - 
formation 1 is the main unit that controls movement
formation 2-3 follow formations 1 unit
only follow 1 if the movement flag is present in the current room
 */

module.exports = {
    run: function(creep) {
        
        if(true){
            creep.moveTo(Game.flags.PHALANX);
            //creep.move(LEFT);
            return;
        }
        
        if(creep.spawning){
            return;
        }
        if(!creep.memory.formation){
            if(creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.formation == 1)})[0] == undefined)
                creep.memory.formation = 1;
            else if(creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.formation == 2)})[0] == undefined)
                creep.memory.formation = 2;
            else if(creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.formation == 3)})[0] == undefined)
                creep.memory.formation = 3;
            else if(creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.formation == 4)})[0] == undefined)
                creep.memory.formation = 4;
        }
        
        if(creep.memory.formation && creep.memory.formation != 1 && 
        creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.formation == 1)})[0].length == 0){
            creep.moveTo(Game.flags.PHALANX);
            return;
        }
        
        if(!creep.memory.leader){
            creep.memory.leader = creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.formation == 1)})[0].id;
        }
        
        var target = creep;
        if(creep.memory.formation){
            if(creep.memory.formation == 1) {
                var fatigue = 0;
                var units = creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.role == 'phalanx')});
                for(let i in units){
                    var unit = units[i];
                    fatigue+=unit.fatigue;
                    if(unit.hits < target.hits)
                        target = unit;
                }
                if(fatigue == 0)
                    creep.moveTo(Game.flags.PHALANX);
                creep.heal(target);
            }else if(creep.memory.formation == 2) {
                var units = creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.role == 'phalanx')});
                for(let i in units){
                    var unit = units[i];
                    if(unit.hits < target.hits)
                        target = unit;
                }
                creep.moveTo(Game.getObjectById(creep.memory.leader).pos.x+1, Game.getObjectById(creep.memory.leader).pos.y);
                creep.heal(target);
            }else if(creep.memory.formation == 3) {
                                var units = creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.role == 'phalanx')});
                for(let i in units){
                    var unit = units[i];
                    if(unit.hits < target.hits)
                        target = unit;
                }
                creep.moveTo(Game.getObjectById(creep.memory.leader).pos.x, Game.getObjectById(creep.memory.leader).pos.y-1);
                creep.heal(target);
            }else if(creep.memory.formation == 4) {
                                var units = creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.role == 'phalanx')});
                for(let i in units){
                    var unit = units[i];
                    if(unit.hits < target.hits)
                        target = unit;
                }
                creep.moveTo(Game.getObjectById(creep.memory.leader).pos.x+1, Game.getObjectById(creep.memory.leader).pos.y-1);
                creep.heal(target);
            }
            creep.heal(Game.getObjectById(creep.memory.target));
        }
    },
    act: function(target, creep) {
                var units = creep.room.find(FIND_MY_CREEPS, {filter: (s) => (s.memory.role == 'phalanx')})
                for(let i in units){
                    var unit = units[i];
                    if(unit.hits < target.hits)
                        target = unit;
                }
                creep.moveTo(Game.getObjectById(creep.memory.leader).pos.x+1, Game.getObjectById(creep.memory.leader).pos.y);
                creep.heal(target);
    }
};