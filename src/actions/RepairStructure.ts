import { Actions } from "./Actions";
import { CreepAction } from "./IAction";

export const RepairStructure: CreepAction = {
  Action: Actions.RepairStructure,
  Condition: (creep: Creep) => creep.room.find(FIND_STRUCTURES, {filter: x => x.hits < x.hitsMax}).length > 0 && creep.carry.energy > 0,
  IsCompleted: (creep: Creep) => {
    return (creep.memory.activeStructure && Game.getObjectById(creep.memory.activeStructure) ? Game.getObjectById<Structure>(creep.memory.activeStructure)!.hits < Game.getObjectById<Structure>(creep.memory.activeStructure)!.hitsMax ||  Game.getObjectById<Structure>(creep.memory.activeStructure)!.hits > 500000 : true) ||
      creep.carry.energy === 0;
  }
};

export function RunRepairStructure(creep: Creep) {
  const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 500000
  });
  if (target !== null && creep.repair(target) === ERR_NOT_IN_RANGE) {
    creep.moveTo(target, {reusePath: 15, visualizePathStyle: {stroke: '#B294BB'}})
  }
  creep.memory.activeStructure = target!.id;
}
