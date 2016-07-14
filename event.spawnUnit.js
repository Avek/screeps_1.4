/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('event.spawnUnit');
 * mod.thing == 'a thing'; // true
 */

module.exports = {
    run: function() {

        
        var minNumberOfHarvesters = 4;
        var minNumberOfUpgraders = 2;
        var minNumberOfRepairers = 2;
        var minNumberOfCollectors = 3;
        var minNumberOfTransporters = 2;
        var minNumberOfSentries = 2;

        var maxCreeps = 14;

        var numberOfCreeps = _.sum(Game.creeps, (c) => c.memory.role != undefined);
        var numberOfExtensions = Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_EXTENSION}}).length;
        //find all creeps in memory and return number of harvesters
        var numberOfHarvesters = _.sum(Game.creeps, (c) => c.memory.role == 'harvester');
        var numberOfUpgraders = _.sum(Game.creeps, (c) => c.memory.role == 'upgrader');
        var numberOfConstructor = _.sum(Game.creeps, (c) => c.memory.role == 'constructor');
        var numberOfBerserkers = _.sum(Game.creeps, (c) => c.memory.role == 'berserker');
        var numberOfRepairers = _.sum(Game.creeps, (c) => c.memory.role == 'repairer');
        var numberOfCollectors = _.sum(Game.creeps, (c) => c.memory.role == 'collector');
        var numberOfTransporters = _.sum(Game.creeps, (c) => c.memory.role == 'transporter');
        var numberOfSentries = _.sum(Game.creeps, (c) => c.memory.role == 'sentry');
        var numberOfAlphas = _.sum(Game.creeps, (c) => c.memory.group == 'alpha');
        var numberOfBetas = _.sum(Game.creeps, (c) => c.memory.group == 'beta');
        var numberOfEnemies = Game.rooms.W44N32.find(FIND_HOSTILE_CREEPS).length;
        Game.rooms.W44N32.memory.tickTracker++;
        Game.underpop = numberOfCreeps < maxCreeps;
        console.log("(#" + numberOfCreeps + "/U" + numberOfUpgraders +
            "/C" + numberOfConstructor + "/R" + numberOfRepairers + "/B" + numberOfBerserkers +
            "/Col" + numberOfCollectors + "/Tr" + numberOfTransporters + "/Sen" + numberOfSentries +
            " || Energy: " + Game.spawns.Spawn1.room.energyAvailable + "/" + Game.spawns.Spawn1.room.energyCapacityAvailable +
            " || Energy/100T: " + (Game.rooms.W44N32.memory.harvest) / (Game.rooms.W44N32.memory.tickTracker) +
            " || Enemies: " + Game.rooms.W44N32.find(FIND_HOSTILE_CREEPS).length +
            " || /Alpha"+numberOfAlphas+"/Beta"+numberOfBetas);


        //
        if (numberOfEnemies > 0) {
            if (Game.spawns.Spawn1.createCreep([TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, TOUGH, MOVE, ATTACK], undefined,
                    {role: 'berserker'}) == ERR_NOT_ENOUGH_ENERGY)
                if (Game.spawns.Spawn1.createCreep([TOUGH, TOUGH, MOVE, ATTACK], undefined,
                        {role: 'berserker'}) == ERR_NOT_ENOUGH_ENERGY) {
                    console.log("RIP");
                }
                else //don't spawn any other unit, something something tea and wait for this whole thing to blow over
                    return;
        }
        if (numberOfCreeps < 7 || Game.spawns.Spawn1.room.energyCapacityAvailable < 500) {
            console.log("level 1 spawns");
            var body = [WORK, CARRY, MOVE, MOVE];
            var collectorBody = [WORK, CARRY, WORK, MOVE];
            var transporterBody = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
            var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, CARRY, MOVE, ATTACK, ATTACK, ATTACK];
        }else if (numberOfCreeps > 7 && Game.spawns.Spawn1.room.energyAvailable >= 500 && Game.spawns.Spawn1.room.energyCapacityAvailable < 800){
            console.log("level 2 spawns");
            var collectorBody = [WORK, WORK, WORK, CARRY, WORK, MOVE];
            var body = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
        }else if (numberOfCreeps > 7 && Game.spawns.Spawn1.room.energyCapacityAvailable >= 500) {
            console.log("level 3 spawns");
            var body = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
            var collectorBody = [WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE];
            var transporterBody = [CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE, CARRY, MOVE];
            var sentryBody = [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, CARRY, MOVE, ATTACK, ATTACK, ATTACK];
        }

        if (Game.underpop) {
            if(numberOfCollectors<minNumberOfCollectors){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(groupRatio){
                    var newUnitName = Game.spawns.Spawn1.createCreep(collectorBody, undefined,
                        {working: false, group: 'beta', role: 'collector'});
                }else
                    var newUnitName = Game.spawns.Spawn1.createCreep(collectorBody, undefined,
                        {working: false, group: 'alpha', role: 'collector'});
                console.log("Spawn1 spawning collector " + newUnitName);
            }
            else if(numberOfTransporters<minNumberOfTransporters){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(groupRatio) {
                    var newUnitName = Game.spawns.Spawn1.createCreep(transporterBody, undefined,
                        {working: false, group: 'beta', role: 'transporter'});
                }else
                    var newUnitName = Game.spawns.Spawn1.createCreep(transporterBody, undefined,
                        {working: false, group: 'alpha', role: 'transporter'});
                console.log("Spawn1 spawning transporter " + newUnitName);
            }
/*            else if(false&&numberOfHarvesters<minNumberOfHarvesters){
                var newUnitName = Game.spawns.Spawn1.createCreep(body, undefined,
                    {working: false, role: 'harvester'});
                console.log("Spawn1 spawning harvester " + newUnitName);
            }*/
            else if(numberOfRepairers<minNumberOfRepairers){
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(groupRatio) {
                    var newUnitName = Game.spawns.Spawn1.createCreep(body, undefined,
                        {working: false, group: 'beta', role: 'repairer'});
                }else
                    var newUnitName = Game.spawns.Spawn1.createCreep(body, undefined,
                        {working: false, group: 'alpha', role: 'repairer', subrole: 'walls'});
                console.log("Spawn1 spawning repairer " + newUnitName);
            }
            else if(numberOfUpgraders<minNumberOfUpgraders) {
                var newUnitName = Game.spawns.Spawn1.createCreep(body, undefined,
                    {working: false, group: 'beta', role: 'upgrader'});
                console.log("Spawn1 spawning upgrader "+newUnitName);
            }
            else if(numberOfSentries<minNumberOfSentries) {
                var newUnitName = Game.spawns.Spawn1.createCreep(sentryBody, undefined,
                    {working: false, role: 'sentry'});
                console.log("Spawn1 spawning sentry " + newUnitName);
            }else{
                var groupRatio = _.sum(Game.creeps, (c) => c.memory.group == 'alpha') > _.sum(Game.creeps, (c) => c.memory.group == 'beta');
                if(false&&groupRatio) {
                    var newUnitName = Game.spawns.Spawn1.createCreep(body, undefined,
                        {working: false, group: 'beta', role: 'constructor'});
                }else
                    var newUnitName = Game.spawns.Spawn1.createCreep(body, undefined,
                        {working: false, group: 'alpha', role: 'constructor'});
                console.log("Spawn1 spawning constructor " + newUnitName + body);
            }
        }
    }
};

/*
 Game.spawns.Spawn1.createCreep([ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH],
 VIKING1, {role:'berserker'});
 [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE] // 500
 [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE] // 800
 [ATTACK, ATTACK, ATTACK, ATTACK, MOVE, MOVE, MOVE, MOVE, TOUGH, TOUGH, TOUGH] //550
 [TOUGH, TOUGH, TOUGH, TOUGH, CARRY, MOVE, CARRY, MOVE, ATTACK, ATTACK, ATTACK] // 500
 MOVE	50	Decreases fatigue by 2 points per tick.
 WORK	100
 Harvests 2 energy units from a source per tick.

 Builds a structure for 5 energy units per tick.

 Repairs a structure for 100 hits per tick consuming 1 energy unit per tick.

 Dismantles a structure for 50 hits per tick returning 0.25 energy unit per tick.

 Upgrades a controller for 1 energy unit per tick.

 CARRY	50	Can contain up to 50 resource units.
 ATTACK	80	Attacks another creep/structure with 30 hits per tick in a short-ranged attack.
 RANGED_ATTACK	150
 Attacks another single creep/structure with 10 hits per tick in a long-range attack up to 3 squares long.

 Attacks all hostile creeps/structures within 3 squares range with 1-4-10 hits (depending on the range).

 HEAL	250	Heals self or another creep restoring 12 hits per tick in short range or 4 hits per tick at a distance.
 CLAIM	600
 Claims a neutral room controller.

 Reserves a neutral room controller for 1 tick per body part.

 Attacks a hostile room controller downgrade or reservation timer with 1 tick per 5 body parts.

 A creep with this body part will have a reduced life time of 500 ticks and cannot be renewed.

 TOUGH	10	No effect, just additional hit points to the creep's body.

 */
 
