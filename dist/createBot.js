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
        viewDistance: options.viewDistance ?? DEFAULTS.viewDistance,
        checkTimeoutInterval: options.checkTimeoutInterval ?? DEFAULTS.checkTimeoutInterval,
        respawnOnDeath: options.respawnOnDeath ?? DEFAULTS.respawnOnDeath,
    };
}
/**
 * GooberCraft Bot Fabrika Fonksiyonu
 */
async function createBot(options) {
    const resolved = resolveOptions(options);
    // 1. En uygun Node'u seç (En boş olanı getirir)
    const node = managers_1.manager.nodes.getAvailableNode();
    const bot = new Bot_1.Bot(resolved);
    if (node) {
        bot.setNodeId(node.id);
        // Node üzerindeki bot sayacını artır
        managers_1.manager.nodes.incrementBotCount(node.id);
        const nodeUrl = node.url;
        // Yerel node tespiti: "local", "master-node-1" veya localhost adresleri HTTP isteği atmaz
        const isLocalNode = node.id === "local" ||
            node.id === "master-node-1" ||
            !nodeUrl ||
            nodeUrl.includes("localhost") ||
            nodeUrl.includes("127.0.0.1");
        // 2. Uzak İşçi (Worker) Node ise Webhook/HTTP ile tetikle
        if (!isLocalNode) {
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
            // Yerel Node ise doğrudan soket bağlantısını başlat
            bot.connect();
        }
    }
    else {
        // Müsait Node bulunamadıysa varsayılan olarak yerelde çalıştır
        bot.setNodeId("local");
        bot.connect();
    }
    const assignedNodeId = bot.getNodeId() || "local";
    // 3. Master durum kaydı
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