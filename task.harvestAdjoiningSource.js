var taskHarvestAdjoiningSource = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var source = Game.rooms.W52N6.find(FIND_SOURCES)[0];
        if (creep.carry.energy < creep.carryCapacity) {
            if (creep.room.name != source.room.name || creep.harvest(source) == ERR_NOT_IN_RANGE)
                creep.moveTo(source);
        } else { // full on energy, start heading back home
            creep.moveTo(Game.rooms.W53N6.controller);
        }
	}
};

module.exports = taskHarvestAdjoiningSource;
