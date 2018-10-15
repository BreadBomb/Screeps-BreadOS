import { ErrorMapper } from "utils/ErrorMapper";
import { Boot } from "./core/boot";
import { UpdateStats } from "./core/stats";
import { IsBuilder, IsHarvester, Roles } from "./enums/Roles";
import {BirthManager} from "./manager/BirthManager";
import { BuilderRole } from "./roles/builder/builderRole";
import { CreepRoleBase } from "./roles/creepRoleBase";
import {HarvesterRole} from "./roles/harvester/harvesterRole";
import {Logger} from "./utils/Logger";

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {
  for (const creep in Memory.creeps) {
    if (!(creep in Game.creeps)) {
      delete Memory.creeps[creep];
      continue;
    }

    const c  = Game.creeps[creep];

    if (!c.room.memory.initialized) {
      Boot.Start(c.room);
    }

    if (BirthManager.CreepCountByRole(Roles.Harvester) < 4) {
      BirthManager.CreateCreep(Roles.Harvester);
    }
    if (BirthManager.CreepCountByRole(Roles.Builder) < 2) {
      Logger.debug("main", "create creep");
      BirthManager.CreateCreep(Roles.Builder);
    }

    if (IsHarvester(c) && !c.spawning) {
      const harvesterRole = new HarvesterRole();
      harvesterRole.runNextStep(c);
    }
    if (IsBuilder(c) && !c.spawning) {
      const builderRole = new BuilderRole();
      builderRole.runNextStep(c);
    }
  }

  for (const tower of Game.spawns.Spawn1.room.find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}})) {
    const t = Game.getObjectById<StructureTower>(tower.id)!;
    const sites = t.room.find(FIND_STRUCTURES, {filter: x => x.hits < x.hitsMax});

    sites.forEach(x => {
      const closestDamagedStructure = t.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits < structure.hitsMax && structure.hits < 500000
      });
      if(closestDamagedStructure) {
        t.repair(closestDamagedStructure);
      }
    });
  }
});
