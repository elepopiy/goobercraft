"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const BotController_1 = require("../controllers/BotController");
const router = (0, express_1.Router)();
router.get("/", BotController_1.BotController.getBots);
router.post("/create", BotController_1.BotController.createBot);
router.post("/stop", BotController_1.BotController.stopBot);
exports.default = router;
//# sourceMappingURL=bots.js.map