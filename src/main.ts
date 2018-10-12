import { ErrorMapper } from "utils/ErrorMapper";
import { Boot } from "./core/boot";
import { UpdateStats } from "./core/stats";
import { IsBuilder, IsHarvester, Roles } from "./enums/Roles";
import {BirthManager} from "./manager/BirthManager";
import { CreepRoleBase } from "./roles/creepRoleBase";
import {HarvesterRole} from "./roles/harvester/harvesterRole";
import {Logger} from "./utils/Logger";
import { BuilderRole } from "./roles/builder/builderRole";

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
    if (BirthManager.CreepCountByRole(Roles.Builder) < 1) {
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
});
