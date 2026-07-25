import { EventBus } from "../core/EventBus";
import { Logger } from "../utils/Logger";

export class FoodManager {
  public food = 20;
  public saturation = 5;

  constructor(private readonly bus: EventBus) {
    this.bus.on("packet:update_health", (data: any) => this.handleUpdateHealth(data));
  }

  private handleUpdateHealth(data: any): void {
    this.food = data.food;
    this.saturation = data.foodSaturation;
    Logger.debug("FoodManager", `açlık güncellendi: food=${this.food}, saturation=${this.saturation}`);
    this.bus.emit("food", { food: this.food, saturation: this.saturation });
  }
}
