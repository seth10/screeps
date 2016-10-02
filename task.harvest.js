let taskHarvest = {
    
    /** @param {Creep} creep **/
    run: function (creep) {
        var source = Game.getObjectById(creep.memory.targetSource);
        if (source == null && creep.memory.targetSource == '579fa8c90700be0674d2e46e') // no creeps in that room, can't see the source for getObjectById
            source = Game.flags['AdjoiningRoomSource'];
        
        let status = creep.harvest(source);
        if (status == ERR_NOT_IN_RANGE || status == ERR_INVALID_TARGET)
            creep.moveTo(source);
    }
};

module.exports = taskHarvest;
