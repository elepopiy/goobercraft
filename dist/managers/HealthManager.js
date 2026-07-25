"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthManager = void 0;
const Logger_1 = require("../utils/Logger");
class HealthManager {
    bus;
    health = 20;
    constructor(bus) {
        this.bus = bus;
        this.bus.on("packet:update_health", (data) => this.handleUpdateHealth(data));
    }
    handleUpdateHealth(data) {
        this.health = data.health;
        Logger_1.Logger.debug("HealthManager", `can güncellendi: ${this.health}`);
        this.bus.emit("health", { health: this.health, food: data.food, saturation: data.foodSaturation });
    }
}
exports.HealthManager = HealthManager;
//# sourceMappingURL=HealthManager.js.map