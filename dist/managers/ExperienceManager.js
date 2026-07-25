"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExperienceManager = void 0;
const Logger_1 = require("../utils/Logger");
class ExperienceManager {
    bus;
    state = { level: 0, progress: 0, total: 0 };
    constructor(bus) {
        this.bus = bus;
        this.bus.on("packet:experience", (data) => this.handleExperience(data));
    }
    handleExperience(data) {
        this.state = {
            level: data.level,
            progress: data.experienceBar,
            total: data.totalExperience,
        };
        Logger_1.Logger.debug("ExperienceManager", `xp güncellendi: level=${this.state.level}`);
        this.bus.emit("experience", this.state);
    }
}
exports.ExperienceManager = ExperienceManager;
//# sourceMappingURL=ExperienceManager.js.map