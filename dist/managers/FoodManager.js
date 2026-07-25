"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoodManager = void 0;
const Logger_1 = require("../utils/Logger");
class FoodManager {
    bus;
    food = 20;
    saturation = 5;
    constructor(bus) {
        this.bus = bus;
        this.bus.on("packet:update_health", (data) => this.handleUpdateHealth(data));
    }
    handleUpdateHealth(data) {
        this.food = data.food;
        this.saturation = data.foodSaturation;
        Logger_1.Logger.debug("FoodManager", `açlık güncellendi: food=${this.food}, saturation=${this.saturation}`);
        this.bus.emit("food", { food: this.food, saturation: this.saturation });
    }
}
exports.FoodManager = FoodManager;
//# sourceMappingURL=FoodManager.js.map