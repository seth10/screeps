let taskBuild = {
    
    /** @param {Creep} creep **/
    run: function (creep) {
        let targets = creep.room.find(FIND_CONSTRUCTION_SITES);
        let status = creep.build(targets[0]);
        if (status == ERR_NOT_IN_RANGE)
            creep.moveTo(targets[0]);
	}
};

module.exports = taskBuild;
