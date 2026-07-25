"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskManager = exports.botManager = exports.nodeManager = void 0;
exports.createBot = createBot;
const Bot_1 = require("./Bot");
// Yeni managerlar
const BotManager_1 = require("./managers/BotManager");
const NodeManager_1 = require("./managers/NodeManager");
const TaskManager_1 = require("./managers/TaskManager");
const DEFAULTS = {
    port: 25565,
    auth: "offline",
    version: "1.20.4",
    viewDistance: 8,
    checkTimeoutInterval: 30000,
    respawnOnDeath: true,
};
// Global managerlar (şimdilik sadece oluşturuluyor)
exports.nodeManager = new NodeManager_1.NodeManager();
exports.botManager = new BotManager_1.BotManager();
exports.taskManager = new TaskManager_1.TaskManager();
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
        viewDistance: options.viewDistance ?? DEFAULTS.viewDistance,
        checkTimeoutInterval: options.checkTimeoutInterval ?? DEFAULTS.checkTimeoutInterval,
        respawnOnDeath: options.respawnOnDeath ?? DEFAULTS.respawnOnDeath,
    };
}
/**
 * GooberCraft Bot Factory
 */
function createBot(options) {
    const resolved = resolveOptions(options);
    // Gelecekte node seçimi burada yapılacak.
    // const node = nodeManager.getAvailableNode();
    const bot = new Bot_1.Bot(resolved);
    // Gelecekte dashboard için kayıt edilecek.
    // botManager.add(...)
    bot.connect();
    return bot;
}
//# sourceMappingURL=createBot.js.map