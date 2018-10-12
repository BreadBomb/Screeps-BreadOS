import { Actions } from "./Actions";
import { CreepAction } from "./IAction";

export const BuildStructure: CreepAction = {
  Action: Actions.BuildStructure,
  Condition: (creep: Creep) => creep.room.find(FIND_MY_CONSTRUCTION_SITES).length > 0 && creep.carry.energy > 0,
  IsCompleted: (creep: Creep) => {
    return (creep.memory.activeStructure ? Game.getObjectById<ConstructionSite>(creep.memory.activeStructure)!.progress === Game.getObjectById<ConstructionSite>(creep.memory.activeStructure)!.progressTotal : true) ||
      creep.carry.energy === 0;
  }
};

export function RunBuildStructure(creep: Creep) {
  const target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
  creep.memory.activeStructure = target!.id;
  if (target !== null && creep.build(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {reusePath: 15, visualizePathStyle: {stroke: '#B294BB'}})
  }
}
