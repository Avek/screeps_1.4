var roleUpgrader = require('role.upgrader');

module.exports = {
    run: function(creep) {

        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            console.log(creep + " is going back to source. ");
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
            console.log(creep + " is going to construction site. ");
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            //roleUpgrader.run(creep); //change this after constructor fix
            //not in range move to spawn
            var constructionSite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            console.log("constructionSite:"+constructionSite);
            if (constructionSite != undefined) {
                if (creep.build(constructionSite) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(constructionSite);
                }
            } else {
                roleUpgrader.run(creep);
            }
        }
        else {
            //creep is not working harvest energy
            //if this creep has been running back and forth too long just stick to one source

            var source = creep.pos.findClosestByPath(FIND_SOURCES);
            //not in range move to source
            if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }else
            {
                creep.memory.timeAwayFromSource = 0;
            }
        }
    }
};