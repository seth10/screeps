/**
 * relevant constants:
 *   SPAWN_ENERGY_CAPACITY = 300
 *   CONTROLLER_STRUCTURES = { "extension": { 3: 10 } }
 *   STRUCTURE_EXTENSION = "extension"
 *   EXTENSION_ENERGY_CAPACITY = { 3: 50 }
 *   BODYPART_COST = { "work": 100, "carry": 50, "move": 50 }
 *   WORK = "work"
 *   CARRY = "carry"
 *   MOVE = "move"
 *   CARRY_CAPACITY = 50
 *   HARVEST_POWER = 2
 *   SOURCE_ENERGY_CAPACITY = 3000 // not used here, but might be useful
 *   UPGRADE_CONTROLLER_POWER = 1
 *
 * possible improvements:
 *   maybe keep a list if efficiency == best['efficiency']
 *   account for fatigue rounding to make a move part unneeded
 *   do the math instead of brute force
 */

/**
 * Find the best set of body parts for a creep. This is intended for a basic harvesting creep with only WORK, CARRY, and MOVE parts.
 * @param {(StructureSpawn|number)} spawn - The spawner which will be spawning the creep, used to call spawn.room.energyCapacityAvailable, or an explicit number of energy capacity
 * @param {number} distance - Distance of path betweem source and controller.
 * @param {boolean} upgradeController - True if the creep will be transfering energy to the room controller (add carry to time) or spawn (dumps all energy in one tick).
 * @returns {Object.<string, number>} best - Information about the best configuration of body parts found.
 * @returns {number} best.efficiency - The total energy mined per trip divided by the ticks to complete that trip.
 * @returns {number} best.work - The number of WORK parts the creep should adopt.
 * @returns {number} best.carry - The number of CARRY parts the creep should adopt.
 * @returns {number} best.move - The number of MOVE parts the creep should adopt.
 */
module.exports.calculateOptimalBodyPartSet = function(spawn, distance, upgradeController = true) {
    var energyCapacity = 0;
    if (spawn && spawn.structureType && spawn.structureType == 'spawn')
        energyCapacity = spawn.room.energyCapacityAvailable;
    else if (typeof spawn === 'number')
        energyCapacity = spawn;
    
    var best = {efficiency:0, work:0, carry:0, move:0};
    for (let work = 1; work <= (energyCapacity - 1*BODYPART_COST[CARRY] - 1*BODYPART_COST[MOVE]) / BODYPART_COST[WORK]; work++) {
        for (let carry = 1; carry <= (energyCapacity - work*BODYPART_COST[WORK] - 1*BODYPART_COST[MOVE]) / BODYPART_COST[CARRY]; carry++) {
            let move = (energyCapacity - work*BODYPART_COST[WORK] - carry*BODYPART_COST[CARRY]) / BODYPART_COST[MOVE];
            //console.log(work, carry, move);
            let timeToGetThere = Math.ceil(work / move) * distance;
            let timeToMine = Math.ceil((carry*CARRY_CAPACITY) / (work*HARVEST_POWER));
            let timeToGetBack = Math.ceil((work + carry) / move) * distance;
            let timeToTransfer = upgradeController ? carry*UPGRADE_CONTROLLER_POWER : 1;
            //console.log(work, carry, move, timeToGetThere, timeToMine, timeToGetBack);
            let totalTime = timeToGetThere + timeToMine + timeToGetBack;
            let energyMined = carry*CARRY_CAPACITY;
            let efficiency = energyMined / totalTime;
            //console.log(work, carry, move, totalTime, energyMined, efficiency);
            if (efficiency > best['efficiency'])
                best = {work:work, carry:carry, move:move, efficiency:efficiency, totalTime:totalTime};
        }
    }
    //console.log(best);
    return best;
}
