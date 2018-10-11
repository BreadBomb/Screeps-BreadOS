export enum Roles {
  Harvester = "harvester"
}

export function IsHarvester(creep: Creep): boolean {
  return creep.memory.role === Roles.Harvester;
}
