import { ErrorMapper } from "utils/ErrorMapper";
import { IsHarvester, Roles } from "./enums/Roles";
import {BirthManager} from "./manager/BirthManager";
import { CreepRoleBase } from "./roles/creepRoleBase";
import {HarvesterRole} from "./roles/harvester/harvesterRole";
import {Logger} from "./utils/Logger";

const birthManager = new BirthManager();

// When compiling TS to JS and bundling with rollup, the line numbers and file names in error messages change
// This utility uses source maps to get the line numbers and file names of the original, TS source code
export const loop = ErrorMapper.wrapLoop(() => {

  if (birthManager.creepCountByRole(Roles.Harvester) < 4) {
    birthManager.createCreep(HarvesterRole);
  }

  for (const creep in Game.creeps) {

    const c  = Game.creeps[creep];

    if (IsHarvester(c) && !c.spawning) {
      const harvesterRole = new HarvesterRole(c.name);
      Logger.debug("main", CreepRoleBase.NeedInitialisation(c));
      harvesterRole.runNextStep(c);
    }


    if (!(creep in Game.creeps)) {
      delete Memory.creeps[creep];
    }
  }
});
