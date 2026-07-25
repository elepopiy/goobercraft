"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const createBot_1 = require("../../createBot");
const managers_1 = require("../../managers");
class BotController {
    // BOT OLUŞTURMA
    static async create(req, res) {
        const { username, host, port, ownerToken } = req.body;
        if (!username || !host) {
            return res.status(400).json({ success: false, message: "Kullanıcı adı ve IP zorunludur!" });
        }
        try {
            const bot = await (0, createBot_1.createBot)({ username, host, port });
            // Sahiplik token'ını bot verisine işle
            const botData = managers_1.manager.bots.get(bot.getId());
            if (botData) {
                botData.ownerToken = ownerToken || "anonymous";
            }
            return res.json({
                success: true,
                message: `'${username}' botu başarıyla başlatıldı!`,
                botId: bot.getId()
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    // BOT DURDURMA / SİLME
    static async stop(req, res) {
        const { id, ownerToken } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Bot ID zorunludur!" });
        }
        const botData = managers_1.manager.bots.get(id);
        if (!botData) {
            return res.status(404).json({ success: false, message: "Bot bulunamadı veya zaten çevrimdışı." });
        }
        // SAHİPLİK KONTROLÜ
        if (botData.ownerToken && botData.ownerToken !== ownerToken) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
            });
        }
        // Botu durdur ve ağdan çıkar
        managers_1.manager.bots.remove(id);
        return res.json({
            success: true,
            message: `'${botData.username}' botu başarıyla durduruldu.`
        });
    }
    static getBots(req, res) {
        return res.json({
            success: true,
            bots: managers_1.manager.bots.getAll()
        });
    }
}
exports.BotController = BotController;
//# sourceMappingURL=BotController.js.map