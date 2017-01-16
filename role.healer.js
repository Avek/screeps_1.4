/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.healer');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function(creep) {
        creep.heal(creep);
        return;
        if(creep.memory.subrole && creep.memory.subrole == 'pair'){
            if(creep.memory.formation == 1){
                if(!creep.memory.buddy){
                    
                    var buddy = creep.room.find(FIND_MY_CREEPS, {filter: (s) => ( s.memory.subrole == 'pair' && s.memory.formation == 2)})[0];
                    if(buddy){
                        creep.memory.buddy = buddy.id; 
                    }
                }
                var target = Game.getObjectById(creep.memory.buddy);
                if(target && (target.hits < creep.hits)){
                    creep.heal(target);
                }else
                    creep.heal(creep);
                creep.moveTo(Game.flags.PAIR);
                return;
            }else if(creep.memory.formation == 2){
                if(!creep.memory.buddy){
                    
                    var buddy = creep.room.find(FIND_MY_CREEPS, {filter: (s) => ( s.memory.subrole == 'pair' && s.memory.formation == 1)})[0];
                    if(buddy){
                        creep.memory.buddy = buddy.id; 
                    }
                }
                var target = Game.getObjectById(creep.memory.buddy);
                if(target && (target.hits < creep.hits)){
                    creep.heal(target);
                }else
                    creep.heal(creep);
                creep.moveTo(target);
                return;
            }
        }
        if(creep.memory.formation == 1)
            creep.moveTo(Game.flags.HEAL);
        if(creep.memory.formation == 2)
            creep.moveTo(Game.flags.HEAL2);
        var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
            filter: (s) => (
                s.memory.role == 'tank'
            )
        });
        if(target)
            creep.heal(target);
        else
            creep.heal(creep);

/*
        var heal = true;

        if (heal) {

            if (!creep.memory.formation) {
                if (_.sum(Game.creeps, (c) => c.memory.formation == 1) == 0)
                    creep.memory.formation = 1;
                if (_.sum(Game.creeps, (c) => c.memory.formation == 2) == 0)
                    creep.memory.formation = 2;
                if (_.sum(Game.creeps, (c) => c.memory.formation == 3) == 0)
                    creep.memory.formation = 3;
                /*if(_.sum(Game.creeps, (c) => c.memory.formation == 4) == 0)
                 creep.memory.formation = 4;
            }


            if (Memory.SQUAD) {
                var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {
                    filter: (s) => (
                        s.memory.formation == Memory.SQUAD
                    )
                });
                creep.moveTo(target);
                console.log(creep.name + " heals: " +creep.heal(target));
            }

        }else{
            creep.moveTo(Game.flags.HEAL);
        }*/

    }
};