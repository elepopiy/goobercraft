"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotManager = void 0;
class BotManager {
    bots = new Map();
    add(bot) {
        this.bots.set(bot.id, bot);
    }
    remove(id) {
        return this.bots.delete(id);
    }
    get(id) {
        return this.bots.get(id);
    }
    getAll() {
        return [...this.bots.values()];
    }
    clear() {
        this.bots.clear();
    }
    count() {
        return this.bots.size;
    }
    exists(id) {
        return this.bots.has(id);
    }
}
exports.BotManager = BotManager;
//# sourceMappingURL=BotManager.js.map