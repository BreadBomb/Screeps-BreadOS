import { Actions } from "./Actions";
import { CreepAction } from "./IAction";

export const FarmEnergy: CreepAction = {
  Action: Actions.FarmEnergy,
  Condition: (creep: Creep) => creep.carry.energy < creep.carryCapacity,
  IsCompleted: (creep: Creep) => {
    return creep.carry.energy === creep.carryCapacity
  }
};

export function RunFarmEnergy(creep: Creep) {
    const target = creep.pos.findClosestByRange(FIND_SOURCES);
    if (target !== null && creep.harvest(target) === ERR_NOT_IN_RANGE) {
      creep.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
    }
}
