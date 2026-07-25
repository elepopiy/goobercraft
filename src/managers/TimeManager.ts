import { EventBus } from "../core/EventBus";

export class TimeManager {
  public age = 0;
  public timeOfDay = 0;

  constructor(private readonly bus: EventBus) {
    this.bus.on("packet:update_time", (data: any) => this.handleUpdateTime(data));
  }

  private handleUpdateTime(data: any): void {
    this.age = Number(data.age);
    const rawTime = typeof data.time === "bigint" ? data.time : BigInt(data.time ?? 0);
    const absTime = rawTime < 0n ? -rawTime : rawTime;
    this.timeOfDay = Number(absTime % 24000n);
    this.bus.emit("time", { age: this.age, timeOfDay: this.timeOfDay });
  }
}
