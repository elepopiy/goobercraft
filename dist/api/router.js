"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const managers_1 = require("../managers");
const routes_1 = __importDefault(require("./routes"));
const router = (0, express_1.Router)();
// GET: /api/nodes -> Web panelinin aktif Node listesini çekmesi için
router.get("/nodes", (_, res) => {
    return res.json({
        success: true,
        nodes: managers_1.manager.nodes.getAllNodes()
    });
});
// POST: /api/nodes/register -> Worker'ların kayıt olduğu adres
// DİKKAT: app.use("/api", ...) kullanıldığı için burada /api yazmıyoruz, sadece /nodes/register yazıyoruz!
router.post("/nodes/register", (req, res) => {
    const { id, name, url, maxBots } = req.body;
    if (!id || !url) {
        return res.status(400).json({
            error: "Eksik bilgi! 'id' ve 'url' zorunludur."
        });
    }
    // Node'u sisteme kaydet
    managers_1.manager.nodes.registerNode({
        id,
        name: name || `Worker (${id})`,
        url,
        maxBots: maxBots || 100
    });
    console.log(`[GooberCraft:Master] 🎉 Yeni Worker başarıyla kaydedildi: ${name} (${url})`);
    return res.json({
        success: true,
        message: `${name} Master Cluster'a eklendi.`
    });
});
router.use(routes_1.default);
exports.default = router;
//# sourceMappingURL=router.js.map