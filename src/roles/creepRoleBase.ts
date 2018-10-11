import { Roles } from "../enums/Roles";
import {Logger} from "../utils/Logger";

export interface CreepAction {
  Action: any;
  Statement: () => boolean,
  IsCompleted: () => boolean
}

export class CreepRoleBase {
  // @ts-ignore
  public Creep: Creep;

  protected Actions: CreepAction[] = [];

  public set ActionSchedule(actions: CreepAction[]) {
    this.Creep.memory.actions = actions;
  }

  public get ActionSchedule(): CreepAction[] {
    return this.Creep.memory.actions;
  }

  public static NeedInitialisation(creep: Creep): boolean {
    return creep.memory.initialized === null ||creep.memory.initialized === undefined;
  }

  public get Role(): Roles {
    throw Logger.danger("You're using it wrong.");
  }

  public initCreep(creep: Creep): void {
    this.Creep.memory.initialized = true;
    this.Creep = creep;
  }

  public runNextStep(creep: Creep) {
    this.Creep = creep;
    if (CreepRoleBase.NeedInitialisation(creep)) {
      return;
    }
  }

}
