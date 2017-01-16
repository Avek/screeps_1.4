
module.exports = {
    run: function(creep) {

        /*
         -- get assigned an area
         -- TODO: find all containers
         -- find which source already has a transporter assigned
         -- find dropoff point
         -- move to source
         -- pickup dropped energy
         -- TODO: pickup energy from container
         --
         */

        //define room to go to
        if(!creep.memory.area){
            if(creep.room.name == "W42S26"){
                if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.memory.area == "W41S26")
                    < Game.rooms["W42S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W42S26";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.memory.area == "W43S26")
                    < Game.rooms["W43S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W43S26";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.memory.area == "W41S26")
                    < Game.rooms["W41S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W41S26";
                }
            }else if(creep.room.name == "W42S27"){
                if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.memory.area == "W42S27")
                    < Game.rooms["W42S27"].find(FIND_SOURCES).length){
                    creep.memory.area = "W42S27";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.memory.area == "W41S27")
                    < Game.rooms["W41S27"].find(FIND_SOURCES).length){
                    creep.memory.area = "W41S27";
                }
            }
        }

        //once in room define source to go to
        if(!creep.memory.source){
            if(creep.room.name == creep.memory.area){
                var sources = creep.room.find(FIND_SOURCES);
                for (var index=0 ; index<sources.length; index++){
                    if(_.sum(Game.creeps, (c) => c.memory.role == 'transporter' && c.memory.source == sources[index].id) == 0)
                        creep.memory.source=sources[index].id;
                }
            }else
                creep.moveTo(creep.memory.area);
        }

        //define dropoff
        // TODO: undo the hardcodes
        if(!creep.memory.dropoff) {
            if (creep.memory.area == "W42S26")
                creep.memory.dropoff = "579eb08f3bd4b218529fe5a5"; //hardcode storage id here
            else if (creep.memory.area == "W42S27")
                creep.memory.dropoff = "57a078316641312868f6dc83"; //hardcode storage id here
            else if (creep.memory.area == "W43S26")
                creep.memory.dropoff = ""; //hardcode link id here
            else if (creep.memory.area == "W41S26")
                creep.memory.dropoff = ""; //hardcode link id here
            else if (creep.memory.area == "W41S27")
                creep.memory.dropoff = ""; //hardcode link id here
        }
        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity)
        {
            creep.memory.working = true;
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {
            var dropoff = Game.getObjectById(creep.memory.dropoff);

            if (creep.transfer(dropoff, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                creep.moveTo(dropoff);
            }
        }else {
            var source = Game.getObjectById(creep.memory.source);
            if (creep.pos.getRangeTo(source) > 1)
                creep.moveTo(source);
            else {
                var target = creep.pos.findClosestByRange(FIND_DROPPED_ENERGY, 3);
                if (target) {
                    if (creep.pickup(target) == ERR_NOT_IN_RANGE) {
                        creep.say("oOooOOo");
                        creep.moveTo(target);
                    }
                }
            }
        }
    }
};