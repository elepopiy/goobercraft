"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const createBot_1 = require("../../createBot");
const managers_1 = require("../../managers");
const nodes_1 = require("../routes/nodes");
class BotController {
    static async create(req, res) {
        const { username, host, port, ownerToken } = req.body;
        // 1. Temel Girdi Kontrolü
        if (!username || !host) {
            return res.status(400).json({ success: false, message: "Kullanıcı adı ve IP zorunludur!" });
        }
        const userToken = ownerToken || "anonymous";
        const allBots = managers_1.manager.bots.getAll();
        // 2. KİŞİ BAŞI BOT LİMİTİ KONTROLÜ (Maksimum 3 Bot)
        const userBotsCount = allBots.filter((b) => b.ownerToken === userToken).length;
        if (userBotsCount >= 3) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bot limitine ulaştınız! Aynı kişi en fazla 3 bot ekleyebilir."
            });
        }
        // 3. EN BOŞ RACK'İ BULMA (Yük Dengeleme)
        let selectedNode = null;
        let minBotCount = Infinity;
        for (const node of nodes_1.nodesList) {
            const nodeBotsCount = allBots.filter((b) => b.nodeId === node.id || b.node_id === node.id).length;
            if (nodeBotsCount < node.maxBots && nodeBotsCount < minBotCount) {
                minBotCount = nodeBotsCount;
                selectedNode = node;
            }
        }
        // 4. GLOBAL KAPASİTE KONTROLÜ (Tüm Rack'ler 100/100 Doluysa)
        if (!selectedNode) {
            return res.status(400).json({
                success: false,
                message: "⛔ Tüm DataCenter Rack'leri tamamen dolu (100/100)! Biri bot çıkarana kadar yeni bot eklenemez."
            });
        }
        try {
            // Botu seçilen en boş Rack üzerine konuşlandır
            const bot = await (0, createBot_1.createBot)({ username, host, port });
            const botData = managers_1.manager.bots.get(bot.getId());
            if (botData) {
                botData.nodeId = selectedNode.id;
                botData.ownerToken = userToken;
            }
            return res.json({
                success: true,
                message: `'${username}' botu ${selectedNode.name} üzerine konuşlandırıldı! (${userBotsCount + 1}/3 botunuz aktif)`,
                botId: bot.getId(),
                nodeId: selectedNode.id
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
        // SAHİPLİK KONTROLÜ (Sadece ekleyen silebilir)
        if (botData.ownerToken && botData.ownerToken !== ownerToken) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
            });
        }
        managers_1.manager.bots.remove(id);
        return res.json({
            success: true,
            message: `'${botData.username}' botu durduruldu. Sizin için +1 bot hakkı tekrar açıldı.`
        });
    }
    // BOTS LİSTELEME
    static getBots(req, res) {
        return res.json({
            success: true,
            bots: managers_1.manager.bots.getAll()
        });
    }
}
exports.BotController = BotController;
//# sourceMappingURL=BotController.js.map