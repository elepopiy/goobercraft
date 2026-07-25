"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeManager = void 0;
class TimeManager {
    bus;
    age = 0;
    timeOfDay = 0;
    constructor(bus) {
        this.bus = bus;
        this.bus.on("packet:update_time", (data) => this.handleUpdateTime(data));
    }
    handleUpdateTime(data) {
        this.age = Number(data.age);
        const rawTime = typeof data.time === "bigint" ? data.time : BigInt(data.time ?? 0);
        const absTime = rawTime < 0n ? -rawTime : rawTime;
        this.timeOfDay = Number(absTime % 24000n);
        this.bus.emit("time", { age: this.age, timeOfDay: this.timeOfDay });
    }
}
exports.TimeManager = TimeManager;
//# sourceMappingURL=TimeManager.js.map