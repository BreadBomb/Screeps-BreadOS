import { Roles } from "../enums/Roles";
import { Actions } from "./Actions";
import { CreepAction } from "./IAction";

export const UpgradeController: CreepAction = {
  Action: Actions.UpgradeController,
  Condition: (creep: Creep) => creep.carry.energy > 0,
  IsCompleted: (creep: Creep) => {
    return creep.carry.energy === 0 || getEnergyTransferTargets(creep).length > 0 && creep.memory.role !== Roles.Builder
  }
};

export function RunUpgradeController(creep: Creep) {
  if (creep.room.controller !== undefined && creep.upgradeController(creep.room.controller) === ERR_NOT_IN_RANGE) {
    creep.moveTo(creep.room.controller, {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
  }
}


function getEnergyTransferTargets(creep: Creep) {
  return creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
    }
  });
}
