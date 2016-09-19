Memory.MAX_CREEPS = 3;
Memory.SPAWN = 0;
//Memory.SOURCE = Game.getObjectById('579fa8b80700be0674d2e2e8');

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
        Game.spawns['Arendelle'].createCreep( [MOVE,MOVE,WORK,CARRY], 'Snowflake' + (Object.keys(Game.creeps).length + 1) );
    }
}
