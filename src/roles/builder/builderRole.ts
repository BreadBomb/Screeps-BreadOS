import { Actions } from "../../actions/Actions";
import { BuildStructure, RunBuildStructure } from "../../actions/BuildStructure";
import { FarmEnergy, RunFarmEnergy } from "../../actions/FarmEnergy";
import { GetEnergy, RunGetEnergy } from "../../actions/GetEnergy";
import { CreepAction } from "../../actions/IAction";
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
    this.Actions.set(Actions.GetEnergy, GetEnergy);
    this.Actions.set(Actions.BuildStructure, BuildStructure);
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

    if (this.IsActionCompleted()) {
      Logger.debug("creep", "action completed");
      this.RemoveFirstAction()
    }

    if (this.ActionSchedule.length === 0) {
      this.GetNextAction();
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
  }

  private GetNextAction() {
    for (let action of this.Actions.values()) {
      if (action.Condition(this.Creep)) {
        this.ActionSchedule.push(action);
        Logger.debug('builder', action);
        break;
      }
    }
  }

  private IsActionCompleted(): boolean {
    if (this.ActionSchedule.length === 0) { return false; }
    Logger.debug("builer", this.Actions.get(this.ActionSchedule[0].Action)!.IsCompleted(this.Creep));
    return this.Actions.get(this.ActionSchedule[0].Action)!.IsCompleted(this.Creep);
  }

  private RemoveFirstAction() {
    this.ActionSchedule.shift();
  }
}
