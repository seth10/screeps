var taskHarvest = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var source = creep.room.find(FIND_SOURCES)[0];
        
        status = creep.harvest(source);
        if(status == ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
        }
        //creep.say('working: '+status);
    }
};

module.exports = taskHarvest;
