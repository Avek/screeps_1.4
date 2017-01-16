
module.exports = {
    run: function(creep) {

        /*
         -- get assigned an area
         -- TODO: find all containers
         -- find which source already has a collector assigned
         -- move to source
         -- harvest/drop energy
         -- TODO: drop energy to container
         */
        //define room to go to
        if(!creep.memory.area){
            if(creep.room.name == "W42S26"){
                if(_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.area == "W41S26")
                    < Game.rooms["W42S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W42S26";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.area == "W43S26")
                    < Game.rooms["W43S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W43S26";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.area == "W41S26")
                    < Game.rooms["W41S26"].find(FIND_SOURCES).length){
                    creep.memory.area = "W41S26";
                }
            }else if(creep.room.name == "W42S27"){
                if(_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.area == "W42S27")
                    < Game.rooms["W42S27"].find(FIND_SOURCES).length){
                    creep.memory.area = "W42S27";
                }else if(_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.area == "W41S27")
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
                    if(_.sum(Game.creeps, (c) => c.memory.role == 'collector' && c.memory.source == sources[index].id) == 0)
                        creep.memory.source=sources[index].id;
                }
            }else
                creep.moveTo(creep.memory.area);
        }

        //creep is out of energy
        if (creep.memory.working == true && creep.carry.energy == 0) {
            creep.memory.working = false;

        }// creep cannot carry any more energy
        else if (creep.memory.working == false && creep.carry.energy == creep.carryCapacity) {
            creep.memory.working = true;
        }
        //creep is working transfer energy
        if (creep.memory.working == true) {

            creep.drop(RESOURCE_ENERGY);
        } else {
            var source = Game.getObjectById(creep.memory.source);
            var retval = creep.harvest(source);
            if(retval == ERR_NOT_IN_RANGE){
                creep.moveTo(source);
            }
        }
    }

};