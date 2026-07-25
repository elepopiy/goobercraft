"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const createBot_1 = require("../../createBot");
const managers_1 = require("../../managers"); // Doğru import en üstte mevcut!
class BotController {
    static getBots(req, res) {
        // En üstte import edilen manager kullanılıyor (require temizlendi)
        res.json({
            success: true,
            bots: managers_1.manager.bots.getAll()
        });
    }
    static async createBot(req, res) {
        const { username, host, port } = req.body;
        if (!host) {
            return res.status(400).json({
                success: false,
                message: "Minecraft Sunucu IP/Host adresi zorunludur!"
            });
        }
        try {
            // Gerçek GooberCraft Bot'unu oluştur ve başlat.
            const bot = await (0, createBot_1.createBot)({
                username: username || `Goob_${Math.floor(Math.random() * 1000)}`,
                host: host,
                port: port ? Number(port) : 25565
            });
            const assignedNodeId = bot.getNodeId() ?? "local";
            res.json({
                success: true,
                message: `'${bot.username}' botu başarıyla '${assignedNodeId}' node'unda başlatıldı!`,
                bot: {
                    id: bot.getId(),
                    username: bot.username,
                    nodeId: assignedNodeId,
                    online: true,
                    createdAt: bot.getCreatedAt()
                }
            });
        }
        catch (error) {
            console.error("[BotController] Bot oluşturma hatası:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Bot başlatılırken bir hata oluştu."
            });
        }
    }
    static stopBot(req, res) {
        const { id } = req.body;
        // En üstte import edilen manager kullanılıyor (require temizlendi)
        const botState = managers_1.manager.bots.get(id);
        if (botState) {
            managers_1.manager.bots.remove(id);
            return res.json({
                success: true,
                message: "Bot başarıyla durduruldu."
            });
        }
        res.json({
            success: false,
            message: "Bot bulunamadı."
        });
    }
}
exports.BotController = BotController;
//# sourceMappingURL=BotController.js.map