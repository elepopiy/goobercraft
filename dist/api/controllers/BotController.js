"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotController = void 0;
class BotController {
    static getBots(req, res) {
        res.json({
            success: true,
            bots: []
        });
    }
    static createBot(req, res) {
        res.json({
            success: true,
            message: "Bot oluşturma sistemi hazırlanıyor."
        });
    }
    static stopBot(req, res) {
        res.json({
            success: true,
            message: "Bot durdurma sistemi hazırlanıyor."
        });
    }
}
exports.BotController = BotController;
//# sourceMappingURL=BotController.js.map