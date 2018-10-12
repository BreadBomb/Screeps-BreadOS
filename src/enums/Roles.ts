export enum Roles {
  Harvester = "harvester",
  Builder = "builder"
}

export function IsHarvester(creep: Creep): boolean {
  return creep.memory.role === Roles.Harvester;
}

export function IsBuilder(creep: Creep): boolean {
  return creep.memory.role === Roles.Builder;
}
