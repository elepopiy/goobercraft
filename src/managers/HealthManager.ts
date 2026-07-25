import { EventBus } from "../core/EventBus";
import { Logger } from "../utils/Logger";

export class HealthManager {
  public health = 20;

  constructor(private readonly bus: EventBus) {
    this.bus.on("packet:update_health", (data: any) => this.handleUpdateHealth(data));
  }

  private handleUpdateHealth(data: any): void {
    this.health = data.health;
    Logger.debug("HealthManager", `can güncellendi: ${this.health}`);
    this.bus.emit("health", { health: this.health, food: data.food, saturation: data.foodSaturation });
  }
}
