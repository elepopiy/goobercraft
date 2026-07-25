"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const createBot_1 = require("../../createBot"); // createBot fabrika fonksiyonunun yolu
class BotController {
    static getBots(req, res) {
        // Master Manager üzerindeki bot listesini döndürür
        const { manager } = require("../managers");
        res.json({
            success: true,
            bots: manager.bots.getAll()
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
            // Bu fonksiyon otomatik olarak en uygun Node'u seçecek ve ona bağlayacak.
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
        const { manager } = require("../managers");
        const botState = manager.bots.get(id);
        if (botState) {
            // Eğer bot nesnesine erişiminiz varsa bot.end() çağrılabilir
            manager.bots.remove(id);
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