import { Logger } from "../utils/Logger";

export class Boot {
  public static Start(room: Room) {
    Logger.warn("BOOT", "This room seems to be not initialized");
    Logger.warn("BOOT", "Start initializing....");
    Logger.warn("BOOT", "Search energy sources");
    this.findEnergySources(room);
    room.memory.initialized = true;
    Logger.success("BOOT", "Initialization successfully finished");
  }

  private static findEnergySources(room: Room) {
    const targets = room.find(FIND_SOURCES);
    room.memory.sources = _.map(targets, t => {
      return { x: t.pos.x, y: t.pos.y }
    });
    targets.forEach(target => {
      Logger.debug("BOOT", "Found source at X: " + target.pos.x + "and Y: " + target.pos.y);
    })
  }

}
