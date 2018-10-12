import { Actions } from "./Actions";
import { CreepAction } from "./IAction";

export const DeliverEnergy: CreepAction = {
  Action: Actions.DeliverEnergy,
  Condition: (creep: Creep) => getEnergyTransferTargets(creep).length > 0,
  IsCompleted: (creep: Creep) => {
    return creep.carry.energy === 0 || getEnergyTransferTargets(creep).length === 0;
  }
};

function getEnergyTransferTargets(creep: Creep) {
  return creep.room.find(FIND_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType === STRUCTURE_EXTENSION ||
        structure.structureType === STRUCTURE_SPAWN ||
        structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
    }
  });
}
