"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./api/router"));
const managers_1 = require("./managers");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json()); // Worker'dan gelen JSON verilerini okumak için ŞART
// 🚨 KRİTİK SIRALAMA:
// 1. API Rotaları (Statik ve HTML yakalayıcısından ÖNCE gelmek zorunda)
app.use("/api", router_1.default);
// 2. Web Paneli Statik Dosyaları
const publicPath = path_1.default.join(process.cwd(), "public");
app.use(express_1.default.static(publicPath));
// 3. SPA Fallback (API dışındaki her istek Dashboard HTML'ine gider)
app.get("*", (_, res) => {
    res.sendFile(path_1.default.join(publicPath, "index.html"));
});
const PORT = Number(process.env.PORT) || 10000;
app.listen(PORT, () => {
    console.log(`[GooberCraft Master] Port ${PORT} üzerinde aktif.`);
    // Master'ın kendi lokal node'unu kaydet
    managers_1.manager.nodes.registerNode({
        id: "master-node-1",
        name: "Master Node (Render)",
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        maxBots: 10
    });
});
//# sourceMappingURL=server.js.map