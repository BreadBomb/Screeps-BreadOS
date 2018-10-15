import { Actions } from "../../actions/Actions";
import { BuildStructure, RunBuildStructure } from "../../actions/BuildStructure";
import { GetEnergy, RunGetEnergy } from "../../actions/GetEnergy";
import { RepairStructure, RunRepairStructure } from "../../actions/RepairStructure";
import { RunUpgradeController, UpgradeController } from "../../actions/UpgradeController";
import { Roles } from "../../enums/Roles";
import { Logger } from "../../utils/Logger";
import { CreepRoleBase } from "../creepRoleBase";

export class BuilderRole extends CreepRoleBase {
  public static get Role() {
    return Roles.Builder;
  }

  constructor() {
    super();
    this.Actions.set(Actions.BuildStructure, BuildStructure);
    this.Actions.set(Actions.RepairStructure, RepairStructure);
    this.Actions.set(Actions.GetEnergy, GetEnergy);
    this.Actions.set(Actions.UpgradeController, UpgradeController);
  }

  public initCreep(creep: Creep) {
    super.initCreep(creep);
    Logger.debug("BUILDER", "Initialize Builder");
    this.Creep.memory.role = Roles.Builder;
    this.ActionSchedule = [GetEnergy];
  }

  public runNextStep(creep: Creep) {
    super.runNextStep(creep);

    if (CreepRoleBase.NeedInitialisation(creep)) {
      this.initCreep(creep);
      return;
    }

    if (creep.room.controller!.ticksToDowngrade < 5000) {
      this.ActionSchedule.unshift(UpgradeController);
      this.ActionSchedule.unshift(GetEnergy);
    }

    if (this.IsActionCompleted()) {
      Logger.debug("creep", "action completed");
      this.RemoveFirstAction()
    }

    if (this.ActionSchedule.length === 0) {
      this.GetNextAction();
    }

    if (this.ActionSchedule.length === 0) {
      return;
    }

    if (this.ActionSchedule[0].Action === Actions.GetEnergy) {
      RunGetEnergy(this.Creep);
    }

    if (this.ActionSchedule[0].Action === Actions.BuildStructure) {
      RunBuildStructure(this.Creep);
    }

    if (this.ActionSchedule[0].Action === Actions.UpgradeController) {
      RunUpgradeController(this.Creep);
    }

    if (this.ActionSchedule[0].Action === Actions.RepairStructure) {
      RunRepairStructure(this.Creep);
    }
  }

  private GetNextAction() {
    for (const action of this.Actions.values()) {
      if (action.Condition(this.Creep)) {
        this.ActionSchedule.push(action);
        Logger.debug('builder', action);
        break;
      }
    }
  }

  private IsActionCompleted(): boolean {
    if (this.ActionSchedule.length === 0) { return false; }
    return this.Actions.get(this.ActionSchedule[0].Action)!.IsCompleted(this.Creep);
  }

  private RemoveFirstAction() {
    this.ActionSchedule.shift();
  }
}
