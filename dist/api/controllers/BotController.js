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
        // 4. GLOBAL KAPASİTE KONTROLÜ
        if (!selectedNode) {
            return res.status(400).json({
                success: false,
                message: "⛔ Tüm DataCenter Rack'leri tamamen dolu (100/100)! Biri bot çıkarana kadar yeni bot eklenemez."
            });
        }
        try {
            // Botu seçilen en boş Rack üzerine konuşlandır
            const botInstance = await (0, createBot_1.createBot)({ username, host, port });
            // Bot ID tespiti
            const targetId = typeof botInstance.getId === 'function' ? botInstance.getId() : botInstance.id;
            const botData = managers_1.manager.bots.get(targetId) || botInstance;
            if (botData) {
                botData.id = targetId;
                botData.nodeId = selectedNode.id;
                botData.ownerToken = userToken;
                botData.username = username;
                botData.host = host;
            }
            return res.json({
                success: true,
                message: `'${username}' botu ${selectedNode.name} üzerine konuşlandırıldı! (${userBotsCount + 1}/3 botunuz aktif)`,
                botId: targetId,
                nodeId: selectedNode.id
            });
        }
        catch (error) {
            return res.status(500).json({ success: false, message: error.message || "Bot başlatılamadı." });
        }
    }
    // BOT DURDURMA / SİLME - GERÇEK KONTROL & TAM KAPATMA
    static async stop(req, res) {
        const { id, ownerToken } = req.body;
        if (!id) {
            return res.status(400).json({ success: false, message: "Bot ID zorunludur!" });
        }
        // 1. Botu ID üzerinden bul
        let botData = managers_1.manager.bots.get(id);
        // Eğer ID doğrudan uyuşmadıysa esnek eşleşme yap
        if (!botData) {
            const allBots = managers_1.manager.bots.getAll();
            botData = allBots.find((b) => b.id === id || b._id === id || b.botId === id);
        }
        if (!botData) {
            return res.status(404).json({ success: false, message: "Bot bulunamadı veya zaten kapatılmış." });
        }
        // 2. SAHİPLİK KONTROLÜ (Sadece oluşturan silebilir)
        if (botData.ownerToken && botData.ownerToken !== ownerToken) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
            });
        }
        try {
            // 3. MINEFLAYER BOTUNU SUNUCUDAN GERÇEKTEN ÇIKAR
            if (typeof botData.quit === 'function') {
                botData.quit();
            }
            else if (typeof botData.end === 'function') {
                botData.end();
            }
            else if (botData.bot && typeof botData.bot.end === 'function') {
                botData.bot.end();
            }
            // 4. BOTS MANAGER BELLEĞİNDEN TAMAMEN KALDIR
            const targetId = botData.id || id;
            managers_1.manager.bots.remove(targetId);
            return res.json({
                success: true,
                message: `'${botData.username || 'Bot'}' durduruldu ve kapatıldı. Sizin için +1 bot hakkı açıldı.`
            });
        }
        catch (err) {
            // Yine de listeden sil
            managers_1.manager.bots.remove(id);
            return res.json({
                success: true,
                message: "Bot zorla kapatıldı ve listeden silindi."
            });
        }
    }
    // BOTS LİSTELEME
    static getBots(req, res) {
        const bots = managers_1.manager.bots.getAll().map((b) => ({
            id: b.id || b._id || b.botId,
            username: b.username,
            host: b.host,
            nodeId: b.nodeId || b.node_id,
            ownerToken: b.ownerToken
        }));
        return res.json({
            success: true,
            bots: bots
        });
    }
}
exports.BotController = BotController;
//# sourceMappingURL=BotController.js.map