import { Actions } from "../../actions/Actions";
import { DeliverEnergy } from "../../actions/DeliverEnergy";
import { FarmEnergy, RunFarmEnergy } from "../../actions/FarmEnergy";
import { UpgradeController } from "../../actions/UpgradeController";
import {Roles} from "../../enums/Roles";
import { Logger } from "../../utils/Logger";
import {CreepRoleBase} from "../creepRoleBase";

export class HarvesterRole extends CreepRoleBase {

  public static get Role() {
    return Roles.Harvester;
  }

  constructor() {
    super();
    this.Actions.set(Actions.FarmEnergy, FarmEnergy);
    this.Actions.set(Actions.DeliverEnergy, DeliverEnergy);
    this.Actions.set(Actions.UpgradeController, UpgradeController);
  }

  public initCreep(creep: Creep) {
    super.initCreep(creep);
    Logger.debug("HARVESTER", "Initialize Harvester");
    this.Creep.memory.role = Roles.Harvester;
    this.ActionSchedule = [FarmEnergy];
  }

  public runNextStep(creep: Creep) {
    super.runNextStep(creep);

    if (CreepRoleBase.NeedInitialisation(creep)) {
      this.initCreep(creep);
      Logger.debug("init", "init");
      return;
    }

    if (this.IsActionCompleted()) {
      this.RemoveFirstAction()
    }

    if (this.ActionSchedule.length === 0) {
      this.GetNextAction();
    }

    Logger.debug('harvester', this.ActionSchedule[0]);

    if (this.ActionSchedule[0].Action === Actions.FarmEnergy) {
      RunFarmEnergy(this.Creep);
    }
    if (this.ActionSchedule[0].Action === Actions.DeliverEnergy) {
      const targets = this.getEnergyTransferTargets();
      if (targets.length > 0 && this.Creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.Creep.moveTo(targets[0], {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
      }
    }
    if (this.ActionSchedule[0].Action === Actions.UpgradeController) {
      if (this.Creep.room.controller !== undefined && this.Creep.upgradeController(this.Creep.room.controller) === ERR_NOT_IN_RANGE) {
        this.Creep.moveTo(this.Creep.room.controller, {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
      }
    }
  }

  private getEnergyTransferTargets() {
    return this.Creep.room.find(FIND_STRUCTURES, {
      filter: (structure) => {
        return (structure.structureType === STRUCTURE_EXTENSION ||
          structure.structureType === STRUCTURE_SPAWN ||
          structure.structureType === STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
      }
    });
  }

  private GetNextAction() {
    for (let action of this.Actions.values()) {
      if (action.Condition(this.Creep)) {
        this.ActionSchedule.push(action);
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
