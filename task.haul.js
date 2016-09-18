var taskHaul = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var target = creep.room.controller; //Game.spawns['Arendelle'];
        
        status = creep.transfer(target, RESOURCE_ENERGY);
        if(status == ERR_NOT_IN_RANGE) {
            creep.moveTo(target);
        }
        //creep.say('carrying: '+status);
    }
};

module.exports = taskHaul;
