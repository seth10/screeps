var taskHarvest = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var sources = creep.room.find(FIND_SOURCES);
        
        status = creep.harvest(sources[0]);
        if(status == ERR_NOT_IN_RANGE) {
            creep.moveTo(sources[0]);
        }
        //creep.say('working: '+status);
    }
};

module.exports = taskHarvest;
