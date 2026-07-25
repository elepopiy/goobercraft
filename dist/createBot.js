"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBot = createBot;
const Bot_1 = require("./Bot");
const managers_1 = require("./managers");
const DEFAULTS = {
    port: 25565,
    auth: "offline",
    version: "1.20.4",
    viewDistance: 8,
    checkTimeoutInterval: 30000,
    respawnOnDeath: true,
};
function resolveOptions(options) {
    if (!options.host)
        throw new Error("GooberCraft: 'host' zorunludur.");
    if (!options.username)
        throw new Error("GooberCraft: 'username' zorunludur.");
    return {
        host: options.host,
        username: options.username,
        password: options.password,
        port: options.port ?? DEFAULTS.port,
        auth: options.auth ?? DEFAULTS.auth,
        version: options.version ?? DEFAULTS.version,
        viewDistance: options.viewDistance ??
            DEFAULTS.viewDistance,
        checkTimeoutInterval: options.checkTimeoutInterval ??
            DEFAULTS.checkTimeoutInterval,
        respawnOnDeath: options.respawnOnDeath ??
            DEFAULTS.respawnOnDeath,
    };
}
/**
 * GooberCraft Bot Factory
 */
function createBot(options) {
    const resolved = resolveOptions(options);
    // Gelecekte en uygun worker burada seçilecek.
    const node = managers_1.manager.nodes.getAvailableNode();
    const bot = new Bot_1.Bot(resolved);
    // Şimdilik local olarak kayıt ediyoruz.
    managers_1.manager.bots.add({
        id: bot.getId(),
        username: resolved.username,
        nodeId: node?.id ?? "local",
        online: true,
        createdAt: bot.getCreatedAt()
    });
    bot.connect();
    return bot;
}
//# sourceMappingURL=createBot.js.map