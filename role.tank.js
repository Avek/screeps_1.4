/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.viking');
 * mod.thing == 'a thing'; // true
 */
// || (creep.memory.retreat && creep.memory.retreat == true)
module.exports = {
    run: function(creep) {

        if(!creep.memory.destination){
            creep.memory.destination = Game.flags.TANK;
        }

        if(creep.hits > 1200 && creep.memory.subrole && creep.memory.subrole == 'tank2')
            creep.say(creep.moveTo(Game.flags.TANK2));
        else if((creep.hits > 1200 && creep.memory.subrole && creep.memory.subrole == 'ram') && (creep.memory.retreat == false)){
            creep.say(creep.moveTo(Game.flags.RAM));
            if(creep.room.name == 'W64S63')
                return;
            //creep.say("Bang!");
            creep.dismantle(creep.pos.findClosestByPath(FIND_STRUCTURES));
        }else if(false && creep.hits > 1200) {
            creep.say(creep.moveTo(Game.flags.TANK));
        }else if(creep.memory.subrole && creep.memory.subrole == 'tank2') {
            creep.say(creep.moveTo(Game.flags.RETREAT2));
            creep.memory.retreat=true;
        }else {
            creep.say(creep.moveTo(Game.flags.RETREAT));
            creep.memory.retreat=true;
        }

        if(creep.hits == creep.hitsMax){
            creep.memory.retreat=false;
        }
        /*if(creep.memory.subrole && creep.memory.subrole == 'tank') {
            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        }else if(creep.memory.subrole && creep.memory.subrole == 'healer'){
            var target = creep.pos.findClosestByPath(FIND_MY_CREEPS, {filter: (s) => (
            s.memory.subrole == 'tank'
        )});
            if(target){
                creep.memory.target = target.id;
            }
        }

        if(!creep.memory.formation){
            if(_.sum(Game.creeps, (c) => c.memory.formation == 1) == 0)
                creep.memory.formation = 1;
            if(_.sum(Game.creeps, (c) => c.memory.formation == 2) == 0)
                creep.memory.formation = 2;
            if(_.sum(Game.creeps, (c) => c.memory.formation == 3) == 0)
                creep.memory.formation = 3;
            /!*if(_.sum(Game.creeps, (c) => c.memory.formation == 4) == 0)
                creep.memory.formation = 4;*!/
        }

        /!*
        12
        T3
         *!/

        if(creep.memory.subrole && creep.memory.subrole == 'healer' && creep.memory.target && creep.memory.formation){
            if(creep.memory.formation == 1) {
                creep.moveTo(Game.getObjectById(creep.memory.target).pos.x, Game.getObjectById(creep.memory.target).pos.y-1);
            }else if(creep.memory.formation == 2) {
                creep.moveTo(Game.getObjectById(creep.memory.target).pos.x+1, Game.getObjectById(creep.memory.target).pos.y-1);
            }else if(creep.memory.formation == 3) {
                creep.moveTo(Game.getObjectById(creep.memory.target).pos.x+1, Game.getObjectById(creep.memory.target).pos.y);
            }
            creep.heal(Game.getObjectById(creep.memory.target));
        }else if(creep.memory.subrole && creep.memory.subrole == 'tank' && creep.memory.formation) {
            var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
                creep.say(creep.attack(target));
        }*/

    }
};