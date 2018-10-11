import {Roles} from "../../enums/Roles";
import { Logger } from "../../utils/Logger";
import {CreepAction, CreepRoleBase} from "../creepRoleBase";

export enum HarvesterActions {
  FarmEnergy,
  DeliverEnergy,
  UpgradeController
}

export class HarvesterRole extends CreepRoleBase {

  public get Role() {
    return Roles.Harvester;
  }

  constructor(name: string) {
    super();
    this.Actions.push({
      Action: HarvesterActions.FarmEnergy,
      IsCompleted: () => {
        return this.Creep.carry.energy === this.Creep.carryCapacity
      },
      Statement: () => this.Creep.carry.energy < this.Creep.carryCapacity
    });
    this.Actions.push({
      Action: HarvesterActions.DeliverEnergy,
      IsCompleted: () => {
        return this.Creep.carry.energy === 0 || this.getEnergyTransferTargets().length === 0;
      },
      Statement: () => this.getEnergyTransferTargets().length > 0
    });
    this.Actions.push({
      Action: HarvesterActions.UpgradeController,
      IsCompleted: () => {
        return this.Creep.carry.energy === 0 || this.getEnergyTransferTargets().length > 0
      },
      Statement: () => true
    });
  }

  public initCreep(creep: Creep) {
    super.initCreep(creep);
    Logger.debug("HARVESTER", "Initialize Harvester");
    this.Creep.memory.role = Roles.Harvester;
    this.ActionSchedule = [this.Actions[HarvesterActions.FarmEnergy], this.Actions[HarvesterActions.DeliverEnergy]];
  }

  public runNextStep(creep: Creep) {
    super.runNextStep(creep);

    if (CreepRoleBase.NeedInitialisation(creep)) {
      this.initCreep(creep);
      return;
    }

    if (this.IsActionCompleted()) {
      this.RemoveFirstAction()
    }

    if (this.ActionSchedule.length === 0) {
      this.GetNextAction();
    }

    Logger.debug("HARVESTER", this.ActionSchedule);
    if (this.ActionSchedule[0].Action === HarvesterActions.FarmEnergy) {
      const target = this.Creep.pos.findClosestByRange(FIND_SOURCES);
      if (target !== null && this.Creep.harvest(target) === ERR_NOT_IN_RANGE) {
        this.Creep.moveTo(target, {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
      }
    }
    if (this.ActionSchedule[0].Action === HarvesterActions.DeliverEnergy) {
      const targets = this.getEnergyTransferTargets();
      if (targets.length > 0 && this.Creep.transfer(targets[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
        this.Creep.moveTo(targets[0], {reusePath: 5, visualizePathStyle: {stroke: '#B294BB'}})
      }
    }
    if (this.ActionSchedule[0].Action === HarvesterActions.UpgradeController) {
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
    this.Actions.some(action => {
      if (action.Statement()) {
        this.ActionSchedule.push(action);
        return true;
      }
      return false;
    })
  }

  private IsActionCompleted(): boolean {
    if (this.ActionSchedule.length === 0) { return false; }
    return this.Actions[this.ActionSchedule[0].Action].IsCompleted();
  }

  private RemoveFirstAction() {
    this.ActionSchedule.shift();
  }
}
