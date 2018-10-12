import {Roles} from "../enums/Roles";
import {CreepRoleBase} from "../roles/creepRoleBase";
import {Logger} from "../utils/Logger";

export class BirthManager {

  public static CreepCountByRole(role: Roles): number {
    return _.filter(Game.creeps, (creep: Creep) => creep.memory.role === role).length
  }

  public static CreateCreep(creepRole: Roles) {
    const name = Math.round(Math.random() * 100);
    Logger.debug('creep', creepRole);

    const code = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE, MOVE], creepRole + "-" + Math.round(Math.random() * 100), {
      memory: {
        role: creepRole,
      } as any
    });
    if (code === OK) {
      Logger.success(creepRole, "Creep successfully generated");
    } else {
      Logger.danger(creepRole, "Error spawning new creep, " + code);
    }
  }

}
