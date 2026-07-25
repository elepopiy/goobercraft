"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const managers_1 = require("../../managers");
class AuthController {
    static register(req, res) {
        const { username, password } = req.body;
        const result = managers_1.manager.users.register(username, password);
        if (!result.success || !result.user) {
            return res.status(400).json({ success: false, message: result.message });
        }
        return res.json({
            success: true,
            message: `'${result.user.username}' hesabı oluşturuldu.`,
            token: result.user.token,
            username: result.user.username,
            role: result.user.role
        });
    }
    static login(req, res) {
        const { username, password } = req.body;
        const result = managers_1.manager.users.login(username, password);
        if (!result.success || !result.user) {
            return res.status(401).json({ success: false, message: result.message });
        }
        return res.json({
            success: true,
            message: `Hoş geldin, ${result.user.username}.`,
            token: result.user.token,
            username: result.user.username,
            role: result.user.role
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=AuthController.js.map