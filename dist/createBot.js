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
async function createBot(options) {
    const resolved = resolveOptions(options);
    // 1. En uygun Node'u bul
    const node = managers_1.manager.nodes.getAvailableNode();
    const bot = new Bot_1.Bot(resolved);
    if (node) {
        bot.setNodeId(node.id);
        // Node üzerindeki bot sayacını artır
        node.currentBots = (node.currentBots || 0) + 1;
        // Node nesnesinde url tanımı opsiyonel veya custom olabilir
        const nodeUrl = node.url;
        // 2. Uzak Node ise Webhook/HTTP ile başlat
        if (node.id !== "local" && nodeUrl) {
            try {
                const response = await fetch(`${nodeUrl}/api/bots/spawn`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        id: bot.getId(),
                        options: resolved
                    })
                });
                if (!response.ok) {
                    throw new Error(`Node (${node.id}) yanıt vermedi: ${response.statusText}`);
                }
            }
            catch (error) {
                console.error(`[GooberCraft] Node ile iletişim kurulamadı, local olarak başlatılıyor:`, error);
                bot.connect();
            }
        }
        else {
            bot.connect();
        }
    }
    else {
        // Müsait Node yoksa yerelde çalıştır
        bot.setNodeId("local");
        bot.connect();
    }
    // Guaranteed string
    const assignedNodeId = bot.getNodeId() || "local";
    // 3. Master state kaydı
    managers_1.manager.bots.add({
        id: bot.getId(),
        username: resolved.username,
        nodeId: assignedNodeId,
        online: true,
        createdAt: bot.getCreatedAt()
    });
    return bot;
}
//# sourceMappingURL=createBot.js.map