Memory.MAX_CREEPS = 3;
Memory.WARN_RATE = 0.9; // send a warning notification when the downgrade timer has reached 90% (meaning 10% lost / ticks passed)
Memory.notified; // whether a notification has been sent for this instance of a downgrade timer drop
Memory.REASSURE_INTERVAL = 5000;
Memory.lastAccidentTick;

var taskHarvest = require('task.harvest');
var taskHaul = require('task.haul');

var tasks = {
    'harvest': taskHarvest.run,
    'haul': taskHaul.run
}

module.exports.loop = function () {

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        
        //update task
        if(creep.memory.task == 'harvest' && creep.carry.energy == creep.carryCapacity)
            creep.memory.task = 'haul';
        if(creep.memory.task == 'haul' && creep.carry.energy == 0)
            creep.memory.task = 'harvest';
        if(!creep.memory.task) //default
            creep.memory.task = 'harvest';
        
        tasks[creep.memory.task](creep);
    }
    
    needMoreSnowflakes = Object.keys(Game.creeps).length < Memory.MAX_CREEPS;
    canCreateSnowflake = Game.spawns['Arendelle'].canCreateCreep([MOVE,MOVE,WORK,CARRY]) == OK;
    if(needMoreSnowflakes && canCreateSnowflake) {
        Game.spawns['Arendelle'].createCreep( [MOVE,MOVE,WORK,CARRY] );
    }
    
    notifications();
}

function notifications() {
    if( !Memory.notified && (Game.rooms.W53N6.controller.level == 2 && Game.rooms.W53N6.controller.ticksToDowngrade <= 5000 * Memory.WARN_RATE) ||
                            (Game.rooms.W53N6.controller.level == 3 && Game.rooms.W53N6.controller.ticksToDowngrade <= 10000 * Memory.WARN_RATE) ) {
        Game.notify('Room controller at level ' + Game.rooms.W53N6.controller.level + ' has a downgrade timer at ' + Game.rooms.W53N6.controller.ticksToDowngrade);
        Memory.notified = true; // notification has been sent, don't keep sending one every tick
    } else if( Memory.notified && (Game.rooms.W53N6.controller.level == 2 && Game.rooms.W53N6.controller.ticksToDowngrade > 5000 * Memory.WARN_RATE) ||
                                  (Game.rooms.W53N6.controller.level == 3 && Game.rooms.W53N6.controller.ticksToDowngrade > 10000 * Memory.WARN_RATE) ) {
        Memory.notified = false; // downgrade timer has gone above warning rate, reset notification sent indicator so a notification will be sent next time it drops
    }
    
    if(!Memory.lastAccidentTick) {
        //Memory.lastAccidentTick = Game.time;
        Memory.lastAccidentTick = 13776040; // my first tick in my first room
    }
    ticksSinceLastAccident = Game.time - Memory.lastAccidentTick;
    if( ticksSinceLastAccident > 0 && (ticksSinceLastAccident % Memory.REASSURE_INTERVAL == 0) ) {
        Game.notify('Everything is A-OK 👍\nTicks since last accident: ' + ticksSinceLastAccident, 0);
    }
}
