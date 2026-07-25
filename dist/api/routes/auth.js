"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AuthController_1 = require("../controllers/AuthController");
const router = (0, express_1.Router)();
// Hesap oluşturma
router.post("/register", (req, res) => {
    AuthController_1.AuthController.register(req, res);
});
// Giriş yapma
router.post("/login", (req, res) => {
    AuthController_1.AuthController.login(req, res);
});
exports.default = router;
//# sourceMappingURL=auth.js.map