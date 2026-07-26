"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
const createBot_1 = require("../../createBot");
const managers_1 = require("../../managers");
const nodes_1 = require("../routes/nodes");
const systemBots_1 = require("../../utils/systemBots");
class BotController {
    static async create(req, res) {
        const { username, host, port, ownerToken, profile } = req.body;
        // 1. Temel Girdi Kontrolü
        if (!username || !host) {
            return res.status(400).json({ success: false, message: "Kullanıcı adı ve IP zorunludur!" });
        }
        const userToken = ownerToken || "anonymous";
        const isAdmin = managers_1.manager.users.isAdmin(userToken);
        const allBots = managers_1.manager.bots.getAll();
        // 2. KİŞİ BAŞI BOT LİMİTİ KONTROLÜ (Maksimum 3 Bot) — admin (core) bu limitten muaftır
        const userBotsCount = allBots.filter((b) => b.ownerToken === userToken).length;
        if (!isAdmin && userBotsCount >= 3) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bot limitine ulaştınız! Aynı kişi en fazla 3 bot ekleyebilir."
            });
        }
        // 3. EN BOŞ RACK'İ BULMA (Yük Dengeleme) - GÜNCEL node listesi + sistem botları dahil kapasite
        const nodesList = (0, nodes_1.getNodesList)();
        if (!nodesList || nodesList.length === 0) {
            return res.status(500).json({
                success: false,
                message: "⛔ Kayıtlı hiçbir node yok. Sunucu başlangıcında master node kaydı yapılmamış olabilir."
            });
        }
        let selectedNode = null;
        let minBotCount = Infinity;
        for (const node of nodesList) {
            const realBotsInNode = allBots.filter((b) => b.nodeId === node.id || b.node_id === node.id).length;
            const systemBotsInNode = (0, systemBots_1.getSystemBotCount)(node.maxBots);
            const nodeBotsCount = realBotsInNode + systemBotsInNode;
            if (nodeBotsCount < node.maxBots && nodeBotsCount < minBotCount) {
                minBotCount = nodeBotsCount;
                selectedNode = node;
            }
        }
        // 4. GLOBAL KAPASİTE KONTROLÜ
        if (!selectedNode) {
            return res.status(400).json({
                success: false,
                message: "⛔ Tüm DataCenter Rack'leri tamamen dolu! Biri bot çıkarana kadar yeni bot eklenemez."
            });
        }
        try {
            // Botu seçilen en boş Rack üzerine konuşlandır
            const botInstance = await (0, createBot_1.createBot)({ username, host, port, profile });
            // Bot ID tespiti
            const targetId = typeof botInstance.getId === 'function' ? botInstance.getId() : botInstance.id;
            const botData = managers_1.manager.bots.get(targetId) || botInstance;
            if (botData) {
                botData.id = targetId;
                botData.nodeId = selectedNode.id;
                botData.ownerToken = userToken;
                botData.username = username;
                botData.host = host;
                botData.profile = profile || "stable";
            }
            return res.json({
                success: true,
                message: `'${username}' botu ${selectedNode.name} üzerine konuşlandırıldı! (${isAdmin ? "admin — limitsiz" : `${userBotsCount + 1}/3 botunuz aktif`})`,
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
        // 0. SİSTEM BOTU KORUMASI - id ne olursa olsun, ne istemciden ne başka bir yoldan durdurulamaz
        if ((0, systemBots_1.isSystemBotId)(id)) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bu bir Sistem Botu! Sistem korumalı botlar durdurulamaz veya silinemez."
            });
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
        // 2. SAHİPLİK KONTROLÜ (Sadece oluşturan kişi VEYA admin/core silebilir)
        const isAdmin = managers_1.manager.users.isAdmin(ownerToken);
        if (!isAdmin && botData.ownerToken && botData.ownerToken !== ownerToken) {
            return res.status(403).json({
                success: false,
                message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
            });
        }
        const targetId = botData.id || id;
        try {
            // 3. GERÇEK Bot instance'ını kayıt defterinden bul ve bağlantıyı FİİLEN kapat.
            // Not: manager.bots sadece düz veri (id/username/nodeId...) tutar; gerçek soketi
            // kapatabilen tek şey createBot() içindeki canlı instance kaydıdır.
            const botInstance = (0, createBot_1.getBotInstance)(targetId);
            if (botInstance) {
                botInstance.end("Owner tarafından durduruldu");
            }
            else if (typeof botData.stop === 'function') {
                botData.stop();
            }
            else if (typeof botData.quit === 'function') {
                botData.quit();
            }
            else if (typeof botData.end === 'function') {
                botData.end();
            }
            else if (botData.bot && typeof botData.bot.stop === 'function') {
                botData.bot.stop();
            }
            else if (botData.bot && typeof botData.bot.end === 'function') {
                botData.bot.end();
            }
            // 4. Bellekten TAMAMEN kaldır (hem canlı instance hem meta veri)
            (0, createBot_1.removeBotInstance)(targetId);
            managers_1.manager.bots.remove(targetId);
            return res.json({
                success: true,
                message: `'${botData.username || 'Bot'}' durduruldu, bağlantısı kesildi ve kapatıldı. Sizin için +1 bot hakkı açıldı.`
            });
        }
        catch (err) {
            // Yine de listeden sil
            (0, createBot_1.removeBotInstance)(targetId);
            managers_1.manager.bots.remove(id);
            return res.json({
                success: true,
                message: "Bot zorla kapatıldı ve listeden silindi."
            });
        }
    }
    // BOTS LİSTELEME - gerçek botlar + backend'in ürettiği sistem botları (isSystem:true)
    static getBots(req, res) {
        const realBots = managers_1.manager.bots.getAll().map((b) => ({
            id: b.id || b._id || b.botId,
            username: b.username,
            host: b.host,
            nodeId: b.nodeId || b.node_id,
            ownerToken: b.ownerToken,
            isSystem: false
        }));
        const systemBots = (0, nodes_1.getNodesList)().flatMap((node) => (0, systemBots_1.getSystemBotsForNode)(node));
        return res.json({
            success: true,
            bots: [...systemBots, ...realBots]
        });
    }
}
exports.BotController = BotController;
//# sourceMappingURL=BotController.js.map