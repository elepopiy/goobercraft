"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BotController_1 = require("../controllers/BotController");
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
exports.default = router;
//# sourceMappingURL=bots.js.map