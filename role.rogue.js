var roleTransporter = require('role.transporter');
var CPU = require('function.CPUmonitor');

module.exports = {
    run: function(creep) {
        // creep.moveTo(49, 41);
        //return;

        // var kill = Game.getObjectById('57845b9015d4809e52390dc1');
        // creep.attack(kill);
        // creep.moveTo(kill);
        //creep.drop(RESOURCE_ENERGY);
        /*        creep.moveTo(3, 16);
         return;*/


        /*
         Game.flags.ROGUE.pos.lookFor(LOOK_TERRAIN)
         Game.creeps.TRA45.room.lookAt(Game.creeps.TRA45.pos.x, Game.creeps.TRA45.pos.y)[1].structure.structureType
         */

        var enemy = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS, {filter: (s) => s.owner.username != 'Momo'
        && s.owner.username != 'Invader'
        && s.owner.username != 'Source Keeper' });
        if(enemy) {
            var distance = enemy.pos.getRangeTo(creep.pos);
        }else{
/*            if(creep.memory.subrole && creep.memory.subrole == 'road destroyer'){
                var target = creep.pos.findClosestByPath(FIND_STRUCTURES, {filter: (s) => s.structureType == 'road'});
                if(target){
                    var ret = creep.rangedAttack(target);
                    if(ret == ERR_NOT_IN_RANGE){
                        creep.moveTo(target);
                    }
                    return;
                }
            }*/
            creep.moveTo(Game.flags.ROGUE);
            creep.heal(creep);
            return;
        }

        if(creep.hitsMax - creep.hits > 200 && distance < 9){
            this.flee(creep,enemy);
        }else if((creep.hitsMax - creep.hits > 200 && distance < 9) || distance < 3){
            this.flee(creep,enemy);
        }else{
            creep.say("Yaaah!");
            creep.moveTo(enemy);
        }
            creep.say(creep.rangedAttack(enemy));
            creep.heal(creep);
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
    },
    flee2: function(creep, enemy){
        var flee = enemy.pos.getDirectionTo(creep.pos)-2+Math.round(Math.random() * 2);
        var moves = [enemy.pos.getDirectionTo(creep.pos)-1, enemy.pos.getDirectionTo(creep.pos), enemy.pos.getDirectionTo(creep.pos)+1];
        var move;
        for (let i in moves) {
            move = moves[i];
            switch(move) {
                case 0:
                    if (creep.room.lookAt(creep.pos.x, creep.pos.y - 1)[0].terrain == 'plain')
                        flee = 1;
                    break;
                case 1:
                    if (creep.room.lookAt(creep.pos.x, creep.pos.y - 1)[0].terrain == 'plain')
                        flee = 1;
                    break;
                case 2:
                    if (creep.room.lookAt(creep.pos.x + 1, creep.pos.y - 1)[0].terrain == 'plain')
                        flee = 2;
                    break;
                case 3:
                    if (creep.room.lookAt(creep.pos.x + 1, creep.pos.y)[0].terrain == 'plain')
                        flee = 3;
                    break;
                case 4:
                    if (creep.room.lookAt(creep.pos.x + 1, creep.pos.y + 1)[0].terrain == 'plain')
                        flee = 4;
                    break;
                case 5:
                    if (creep.room.lookAt(creep.pos.x, creep.pos.y + 1)[0].terrain == 'plain')
                        flee = 5;
                    break;
                case 6:
                    if (creep.room.lookAt(creep.pos.x - 1, creep.pos.y + 1)[0].terrain == 'plain')
                        flee = 6;
                    break;
                case 7:
                    if (creep.room.lookAt(creep.pos.x - 1, creep.pos.y)[0].terrain == 'plain')
                        flee = 7;
                    break;
                case 8:
                    if (creep.room.lookAt(creep.pos.x - 1, creep.pos.y - 1)[0].terrain == 'plain')
                        flee = 8;
                    break;
                case 9:
                    if (creep.room.lookAt(creep.pos.x - 1, creep.pos.y - 1)[0].terrain == 'plain')
                        flee = 8;
                    break;
                default:
                    flee = 0;
            }
        }
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