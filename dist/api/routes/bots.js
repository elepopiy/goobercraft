"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BotController_1 = require("../controllers/BotController");
const createBot_1 = require("../../createBot");
const router = (0, express_1.Router)();
// Bot Listeleme Endpoint'i
router.get("/", (req, res) => {
    BotController_1.BotController.getBots(req, res);
});
// Bot Oluşturma Endpoint'i
router.post("/create", (req, res) => {
    BotController_1.BotController.create(req, res);
});
// Bot Durdurma Endpoint'i
router.post("/stop", (req, res) => {
    BotController_1.BotController.stop(req, res);
});
// Worker/Node tarafında doğrudan spawn işlemi için endpoint
router.post("/spawn", async (req, res) => {
    try {
        const { id, options } = req.body || {};
        if (!options?.host || !options?.username) {
            return res.status(400).json({ success: false, message: "Host ve username zorunludur." });
        }
        const bot = await (0, createBot_1.createBot)({
            host: options.host,
            username: options.username,
            password: options.password,
            port: options.port ?? 25565,
            auth: options.auth,
            version: options.version,
            viewDistance: options.viewDistance,
            checkTimeoutInterval: options.checkTimeoutInterval,
            respawnOnDeath: options.respawnOnDeath,
            profile: options.profile ?? "stable",
        });
        return res.json({
            success: true,
            message: "Bot başarıyla spawn edildi.",
            botId: id || bot.getId(),
            nodeId: bot.getNodeId() || "local"
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: error.message || "Bot spawn edilemedi." });
    }
});
exports.default = router;
//# sourceMappingURL=bots.js.map