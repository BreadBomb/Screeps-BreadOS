export interface CreepAction {
  Action: any;
  IsCompleted: (creep: Creep) => boolean;
  Condition: (creep: Creep) => boolean;
}
