import {Roles} from "../enums/Roles";
import {CreepRoleBase} from "../roles/creepRoleBase";
import {Logger} from "../utils/Logger";

export class BirthManager {

  public creepCountByRole(role: Roles): number {
    return _.where(Game.creeps, (creep: Creep) => creep.memory.role === role).length
  }

  public createCreep<T extends CreepRoleBase>(creep: new (n: string) => T): CreepRoleBase {
    const name = Math.round(Math.random() * 100);
    const c = new creep(name + "");

    const code = Game.spawns.Spawn1.spawnCreep([WORK, CARRY, MOVE], c.Role + "-" + Math.round(Math.random() * 100), {
      memory: {
        role: c.Role,
      } as any
    });
    if (code === OK) {
      Logger.success(c.Role, "Creep successfully generated");
    } else {
      Logger.danger(c.Role, "Error spawning new creep, " + code);
    }
    return c;
  }

}
