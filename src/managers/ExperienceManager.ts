import { EventBus } from "../core/EventBus";
import { ExperienceState } from "../utils/types";
import { Logger } from "../utils/Logger";

export class ExperienceManager {
  public state: ExperienceState = { level: 0, progress: 0, total: 0 };

  constructor(private readonly bus: EventBus) {
    this.bus.on("packet:experience", (data: any) => this.handleExperience(data));
  }

  private handleExperience(data: any): void {
    this.state = {
      level: data.level,
      progress: data.experienceBar,
      total: data.totalExperience,
    };
    Logger.debug("ExperienceManager", `xp güncellendi: level=${this.state.level}`);
    this.bus.emit("experience", this.state);
  }
}
