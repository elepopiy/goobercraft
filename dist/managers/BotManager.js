"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotManager = void 0;
class BotManager {
    bots = new Map();
    add(bot) {
        this.bots.set(bot.id, bot);
    }
    remove(id) {
        this.bots.delete(id);
    }
    get(id) {
        return this.bots.get(id);
    }
    getAll() {
        return [...this.bots.values()];
    }
}
exports.BotManager = BotManager;
//# sourceMappingURL=BotManager.js.map