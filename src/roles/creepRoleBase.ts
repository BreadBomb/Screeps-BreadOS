import { Actions } from "../actions/Actions";
import { CreepAction } from "../actions/IAction";
import { Roles } from "../enums/Roles";
import {Logger} from "../utils/Logger";

export class CreepRoleBase {
  // @ts-ignore
  public Creep: Creep;

  protected Actions: Map<Actions, CreepAction> = new Map<Actions, CreepAction>();

  public set ActionSchedule(actions: CreepAction[]) {
    this.Creep.memory.actions = actions;
  }

  public get ActionSchedule(): CreepAction[] {
    return this.Creep.memory.actions;
  }

  public static NeedInitialisation(creep: Creep): boolean {
    return creep.memory.initialized === null ||creep.memory.initialized === undefined;
  }

  public static get Role(): Roles | null {
    Logger.danger('Creep', "You're using it wrong.");
    return null;
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
