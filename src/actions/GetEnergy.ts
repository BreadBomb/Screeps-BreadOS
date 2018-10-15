import { Logger } from "../utils/Logger";
import { Actions } from "./Actions";
import { CreepAction } from "./IAction";

export const GetEnergy: CreepAction = {
  Action: Actions.GetEnergy,
  Condition: (creep: Creep) => creep.carry.energy < creep.carryCapacity && Game.spawns.Spawn1.memory.birthRetry === 0,
  IsCompleted: (creep: Creep) => {
    Logger.debug("dawd", creep.room.energyAvailable);
    return creep.carry.energy === creep.carryCapacity || creep.room.energyAvailable === 0;
  }
};

function getEnergyTransferTargets(creep: Creep) {
  return creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_TOWER) && structure.energy <= structure.energyCapacity;
    }
  });
}

export function RunGetEnergy(creep: Creep) {
  const target = getEnergyTransferTargets(creep)[0];
  if (target !== null && creep.withdraw(target, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
  }
}
