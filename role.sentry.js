var roleTransporter = require('role.transporter');

module.exports = {
    run: function(creep) {
        // creep.moveTo(49, 41);
        //return;

        // var kill = Game.getObjectById('57845b9015d4809e52390dc1');
        // creep.attack(kill);
        // creep.moveTo(kill);
        //creep.moveTo(40, 45);
        //return;
        var enemies = creep.pos.findClosestByPath(FIND_HOSTILE_CREEPS);
        var enemy_structures = creep.pos.findClosestByPath(FIND_HOSTILE_STRUCTURES);
        var enemy_spawn = creep.pos.findClosestByPath(FIND_HOSTILE_SPAWNS);

        if (false && enemies != undefined) {
            if (creep.attack(enemies) == ERR_NOT_IN_RANGE) {
                creep.say("Die enemy!");
                creep.moveTo(enemies);
            }
        } else {
            creep.say("covering transporters");
            if(creep.memory.group == undefined){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'bravo') > _.sum(Game.creeps, (c) => c.memory.group == 'charlie');
                if(groupRatio){
                    creep.memory.group= 'charlie';
                }else
                    creep.memory.group= 'bravo';
            }
            roleTransporter.run(creep);
        }
    }
};