/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('role.viking');
 * mod.thing == 'a thing'; // true
 */

var roleRogue = require('role.rogue');

module.exports = {
    run: function(creep) {

        var attack = true; //ignore destination, fight enemies!
        if(!creep.memory.subrole || !creep.memory.destination){
            this.init(creep);
        }

        var target = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);

        if(target && attack){
            //attack!
            if(creep.memory.subrole == 'tank'){
                if(creep.hitsMax - creep.hits == 0)
                    creep.memory.flee=false;
                if(creep.hitsMax - creep.hits > creep.hitsMax/4 || creep.memory.flee){
                    creep.say("healz!");
                    creep.memory.flee=true;
                    var ret = creep.moveTo((creep.pos.findInRange(FIND_MY_CREEPS, 20,{filter: (c) => c.memory.subrole == 'healer'}))[0]);
                    console.log(creep.name + ' tries to move: '+ret);
                    return;
                }
                if (creep.attack(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            }else if(creep.memory.subrole == 'healer'){
                var distance = target.pos.getRangeTo(creep.pos);
                if(distance < 4) {
                    this.flee(creep, target);
                }
                //var team = Game.creeps.PALADIN2.pos.findInRange(FIND_MY_CREEPS, 4,{filter: (c) => c.memory.role == 'paladin'});
                creep.heal(_.sortBy(creep.pos.findInRange(FIND_MY_CREEPS, 4,{filter: (c) => c.memory.subrole == 'tank'}), 'hits')[0]);
                //creep.moveTo(creep.pos.findInRange(FIND_MY_CREEPS, 10,{filter: (c) => c.memory.subrole == 'tank'})[0]);
            }
        }else{
            if(creep.memory.destination) {
                if (!creep.pos.inRangeTo(creep.memory.destination, 4))
                    creep.moveTo(creep.memory.destination);
            }
        }

    },

    init: function(creep){
        creep.memory.destination = Game.flags.RALLY;
        for(var i in creep.body){
            var part = creep.body[i];
            creep.memory.subrole = 'tank';
            console.log("role assigned: tank");
            if(part.type == "heal"){
                creep.memory.subrole = 'healer';
                console.log("role assigned: healer");
                break;
            }
        }
    },

    flee: function(creep, enemy){
        var flee = enemy.pos.getDirectionTo(creep.pos)-2+Math.round(Math.random() * 2);
        var moves = [];
        if(flee == 0)
            flee = 8;
        else if(flee == 9)
            flee = 1;
        else if(flee == -1)
            flee = 8;
        var ret = creep.move(flee);
        creep.say(flee+": "+ret);
        //creep.say("Waaah!");
    }
};