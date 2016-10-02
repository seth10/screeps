Memory.MAX_CREEPS = 12;
Memory.WARN_RATE = 0.9; // send a warning notification when the downgrade timer has reached 90% (meaning 10% lost / ticks passed)
if (Memory.notified == undefined) // whether a notification has been sent for this instance of a downgrade timer drop
    Memory.notified = false;
Memory.REASSURE_INTERVAL = 5000;
if (Memory.ticksSinceLastAccident == undefined)
    Memory.ticksSinceLastAccident = Game.time - 13776040; // my first tick in my first room

let taskHarvest = require('task.harvest');
let taskHaul = require('task.haul');
let taskBuild = require('task.build');

let tasks = {
    'harvest': taskHarvest.run,
    'haul': taskHaul.run,
    'build': taskBuild.run
};

module.exports.loop = function () {
    
    for (let name in Game.creeps) {
        let creep = Game.creeps[name];
        
        // fix missing memory values
        if (!creep.memory.targetSource)
            creep.memory.targetSource = Game.spawns['Arendelle'].room.find(FIND_SOURCES)[0].id;
        if (!creep.memory.task)
            creep.memory.task = 'harvest';
        
        // update task
        if (creep.memory.task == 'harvest' && creep.carry.energy == creep.carryCapacity) {
            var somecreepHauling = false;
            for (let n in Game.creeps)
                if (Game.creeps[n].memory.task == 'haul')
                    somecreepHauling = true;
            if (!somecreepHauling || creep.room.find(FIND_CONSTRUCTION_SITES).length == 0)
                creep.memory.task = 'haul';
            else
                creep.memory.task = 'build';
        }
        if ((creep.memory.task == 'haul' || creep.memory.task == 'build') && creep.carry.energy == 0)
            creep.memory.task = 'harvest';
        
        tasks[creep.memory.task](creep);
    }
    
    spawnCreeps();
    
    notifications();
    
    cleanMemory();
    
};

function spawnCreeps() {
    let needMoreSnowflakes = Object.keys(Game.creeps).length < Memory.MAX_CREEPS;
    if (!needMoreSnowflakes)
        return;
    
    // ..b8..2e8 -> near  `Game.spawns['Arendelle'].room.find(FIND_SOURCES)[0].id;`
    // ..c9..46e -> far  `Game.rooms[Game.map.describeExits(Game.spawns['Arendelle'].room.name)[RIGHT]].find(FIND_SOURCES)[0].id;`
    var creepsHarvestingAdjoiningSource = 0;
    for (let n in Game.creeps)
        if (Game.creeps[n].memory.targetSource == '579fa8c90700be0674d2e46e')
            creepsHarvestingAdjoiningSource++;
    
    if (creepsHarvestingAdjoiningSource < 7)
        Game.spawns['Arendelle'].createCreep([MOVE,MOVE,WORK,CARRY,CARRY], {'targetSource': '579fa8c90700be0674d2e46e'});
    else
        Game.spawns['Arendelle'].createCreep([MOVE,WORK,WORK,CARRY], {'targetSource': '579fa8b80700be0674d2e2e8'});
    // if spawning fails, this method will be called again next tick, repeated until the source has enough energy
}

function notifications() {
    let ticksToDowngrade = Game.rooms.W53N6.controller.ticksToDowngrade;
    let tickThreshold = CONTROLLER_DOWNGRADE[Game.rooms.W53N6.controller.level] * Memory.WARN_RATE;
    if (ticksToDowngrade <= tickThreshold) {
        if (Memory.notified == false) {
            Game.notify('Room controller at level ' + Game.rooms.W53N6.controller.level + ' in room ' + Game.rooms.W53N6.name + ' has a downgrade timer at ' + ticksToDowngrade);
            Memory.notified = true;
        }
        Memory.ticksSinceLastAccident = 0; // ;(
    } else if (ticksToDowngrade > tickThreshold) {
        if (Memory.notified == true)
            Memory.notified = false;
        Memory.ticksSinceLastAccident++;
    }
    
    if (Memory.ticksSinceLastAccident > 0 && (Memory.ticksSinceLastAccident % Memory.REASSURE_INTERVAL == 0)) {
        Game.notify('Everything is A-OK 👍\nTicks since last accident: ' + Memory.ticksSinceLastAccident, 0);
    }
}

function cleanMemory() {
    for (let creep in Memory.creeps)
        if (Game.creeps[creep] == undefined)
            delete Memory.creeps[creep];
}
