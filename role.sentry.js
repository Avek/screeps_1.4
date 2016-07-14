var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {
        // creep.moveTo(49, 41);
        //return;

        // var kill = Game.getObjectById('57845b9015d4809e52390dc1');
        // creep.attack(kill);
        // creep.moveTo(kill);
        //creep.drop(RESOURCE_ENERGY);
/*        creep.moveTo(30, 30);
        return;*/
        var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemy_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemy_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);

        if (false && enemies != undefined) {
            if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {
                creep.say("Die enemy!");
                creep.moveTo(enemies);
            }
        } else if(false) {
            creep.say("covering transporters");
            if(creep.memory.group == undefined){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(groupRatio){
                    creep.memory.group= 'beta';
                }else
                    creep.memory.group= 'alpha';
            }
            roleTransporter.run(creep);
        }
    }
};