import {Roles} from "../enums/Roles";
import { CreepConfigurations } from "../roles/creepConfigurations";
import {CreepRoleBase} from "../roles/creepRoleBase";
import {Logger} from "../utils/Logger";

export class BirthManager {

  public static CreepCountByRole(role: Roles): number {
    return _.filter(Game.creeps, (creep: Creep) => creep.memory.role === role).length
  }

  public static CreateCreep(creepRole: Roles) {
    Logger.debug('creep', creepRole);

    if (Game.spawns.Spawn1.room.energyAvailable < Game.spawns.Spawn1.room.energyCapacityAvailable && Game.spawns.Spawn1.memory.birthRetry < 500) {
      Game.spawns.Spawn1.memory.birthRetry++;
      Logger.debug("BirthManager", "Wait " + (500 - Game.spawns.Spawn1.memory.birthRetry) +  " Ticks more for energy to restore.")
      return;
    }

    this.spawnCreep(creepRole);
  }

  private static spawnCreep(creepRole: Roles, nameExtension?: string) {
    const code = Game.spawns.Spawn1.spawnCreep(this.calculateBody(creepRole), creepRole + "_" + BirthManager.CreepCountByRole(creepRole) + 1 + (nameExtension ? nameExtension : ''), {
      memory: {
        role: creepRole,
      } as any
    });
    if (code === OK) {
      Logger.success(creepRole, "Creep successfully generated");
      Game.spawns.Spawn1.memory.birthRetry = 0;
    } else {
      Logger.danger(creepRole, "Error spawning new creep, " + code);
      if (code === ERR_NAME_EXISTS) {
        this.spawnCreep(creepRole, "_" + Math.round(Math.random() * 100))
      }
    }
  }

  private static calculateBody(role: Roles): BodyPartConstant[] {
    const config = CreepConfigurations.get(role);
    const maxEnergy = Game.spawns.Spawn1.room.energyAvailable;
    let configResult: BodyPartConstant[] = [];
    Logger.debug("BirthManager", "Room has " + maxEnergy + " to build a creep.");

    let lastItem: BodyPartConstant;

    let energy = 0;

    while (energy < maxEnergy) {
      lastItem = config![configResult.length % config!.length];
      if (energy + BODYPART_COST[lastItem] > maxEnergy) {break;}
      configResult.push(config![configResult.length % config!.length]);
      energy += BODYPART_COST[lastItem];
    }

    Logger.debug("BirthManager", "Load creep with configuration: " + configResult.join(", "));

    configResult = _.sortBy(configResult, x => x.toString());

    return configResult;
  }

}
