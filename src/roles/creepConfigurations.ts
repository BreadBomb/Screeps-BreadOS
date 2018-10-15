import { Roles } from "../enums/Roles";

export const CreepConfigurations: Map<Roles, BodyPartConstant[]> = new Map<Roles, BodyPartConstant[]>([
  [Roles.Harvester, [MOVE, WORK, MOVE, CARRY]],
  [Roles.Builder, [MOVE, WORK, CARRY, WORK]]
]);
