var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleConstructor = require('role.constructor');

module.exports.loop = function () {

    //clear memory
    for(let name in Memory.creeps){

        if(Game.creeps[name] == undefined) {
            delete Memory.creeps[name];
        }
        //Update all creep memory below this line...
        //Game.creeps[name].memory.destination = 0;
        //Game.creeps.Josiah.role= 'constructor'
        //Game.creeps[name].role = 'constructor'
    }
    var minNumberOfHarvesters = 4;
    var minNumberOfUpgraders = 2;
    //find all creeps in memory and return number of harvesters
    var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
    var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
    var numberOfConstructor = _.sum(Game.creeps, (c) => c.memory.role == 'constructor');
    console.log("H/U/C "+numberOfHarvesters+"/"+numberOfUpgraders+"/"+numberOfConstructor+
        " || Energy: "+Game.spawns.Spawn1.energy + "/"+Game.spawns.Spawn1.energyCapacity);
    if (Game.spawns.Spawn1.energyCapacity == Game.spawns.Spawn1.energy) {
        console.log("Spawn1 is full on energy: " + Game.spawns.Spawn1.energy + "/" + Game.spawns.Spawn1.energyCapacity);

        if(numberOfHarvesters>minNumberOfHarvesters) {
            if(numberOfUpgraders<minNumberOfUpgraders){
                var newUnitName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined,
                    {working: false, role: 'upgrader'});
                console.log("Spawn1 spawned upgrader "+newUnitName);
            }
            else {
                var newUnitName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined,
                    {working: false, role: 'constructor'});
                console.log("Spawn1 spawned constructor " + newUnitName);
            }
        }
        else {
            var newUnitName = Game.spawns.Spawn1.createCreep([WORK, CARRY, MOVE, MOVE], undefined,
                {working: false, role: 'harvester'});
            console.log("Spawn1 spawned harvester "+newUnitName);
        }
    }

    for (let name in Game.creeps) {
        var creep = Game.creeps[name];

        if (creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }

        if (creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }

        if (creep.memory.role == 'constructor') {
            roleConstructor.run(creep);
        }

    }
}