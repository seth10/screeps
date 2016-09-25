var taskHarvestAdjoiningSource = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var flag = Game.flags['AdjoiningRoomSource'];
        if (creep.carry.energy <= creep.carryCapacity) {
            if (creep.room.name != flag.room.name || creep.harvest(flag.pos.lookFor(LOOK_SOURCES)[0]) == ERR_NOT_IN_RANGE)
                creep.moveTo(flag);
        } else { // full on energy, start heading back home
            creep.moveTo(Game.rooms.W53N6.controller);
        }
	}
};

module.exports = taskHarvestAdjoiningSource;
