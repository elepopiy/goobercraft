"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.findPath = exports.createBuildPlanSteps = exports.Item = exports.Window = exports.raycast = exports.World = exports.PlayerEntity = exports.Entity = exports.PluginManager = exports.EventBus = exports.Bot = exports.createBot = void 0;
exports.createServer = createServer;
exports.startServer = startServer;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const router_1 = __importDefault(require("./api/router"));
const managers_1 = require("./managers");
// ==========================================
// Express / Server Kurulumu
// ==========================================
/**
 * Express uygulamasını yapılandırır ve döndürür.
 */
function createServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json()); // Worker verilerini okumak için
    // 1. API Rotaları (Öncelikli)
    app.use("/api", router_1.default);
    // 2. Statik Web Paneli Dosyaları
    const publicPath = path_1.default.join(process.cwd(), "public");
    app.use(express_1.default.static(publicPath));
    // 3. SPA Fallback (Diğer tüm frontend rotaları için)
    app.get("*", (req, res) => {
        // API çağrıları yanlışlıkla buraya düşerse 404 döndür
        if (req.path.startsWith("/api")) {
            return res.status(404).json({ error: "API rotası bulunamadı." });
        }
        res.sendFile(path_1.default.join(publicPath, "index.html"), (err) => {
            if (err && !res.headersSent) {
                res.status(500).send("Web paneli (index.html) yüklenemedi.");
            }
        });
    });
    return app;
}
/**
 * Master sunucusunu başlatır ve node kaydını yapar.
 */
function startServer(port) {
    const app = createServer();
    const PORT = port || Number(process.env.PORT) || 10000;
    const MAX_BOTS = Number(process.env.MAX_BOTS || 100);
    const server = app.listen(PORT, () => {
        console.log(`[GooberCraft Master] Port ${PORT} üzerinde aktif.`);
        // Master'ın kendi lokal node'unu kaydet
        managers_1.manager.nodes.registerNode({
            id: "master-node-1",
            name: "Master Node (Render)",
            url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
            maxBots: MAX_BOTS,
        });
    });
    // Render ve Cloud ortamlarında temiz kapanma (Graceful Shutdown)
    const handleShutdown = (signal) => {
        console.log(`\n[GooberCraft] ${signal} alındı, sunucu kapatılıyor...`);
        server.close(() => {
            console.log("[GooberCraft] HTTP Sunucu kapatıldı.");
            process.exit(0);
        });
    };
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));
    process.on("SIGINT", () => handleShutdown("SIGINT"));
    return server;
}
// Otomatik başlatma (AUTO_START=false verilmediği sürece çalışır)
if (process.env.AUTO_START !== "false") {
    startServer();
}
// ==========================================
// GooberCraft Public API Exportları
// ==========================================
// Main Factory & Core Bot
var createBot_1 = require("./createBot");
Object.defineProperty(exports, "createBot", { enumerable: true, get: function () { return createBot_1.createBot; } });
var Bot_1 = require("./Bot");
Object.defineProperty(exports, "Bot", { enumerable: true, get: function () { return Bot_1.Bot; } });
// Core System & Managers (Cluster / Multi-node yönetimi için)
var EventBus_1 = require("./core/EventBus");
Object.defineProperty(exports, "EventBus", { enumerable: true, get: function () { return EventBus_1.EventBus; } });
var PluginManager_1 = require("./core/PluginManager");
Object.defineProperty(exports, "PluginManager", { enumerable: true, get: function () { return PluginManager_1.PluginManager; } });
// Entities & World
var Entity_1 = require("./entity/Entity");
Object.defineProperty(exports, "Entity", { enumerable: true, get: function () { return Entity_1.Entity; } });
var PlayerEntity_1 = require("./entity/PlayerEntity");
Object.defineProperty(exports, "PlayerEntity", { enumerable: true, get: function () { return PlayerEntity_1.PlayerEntity; } });
var World_1 = require("./world/World");
Object.defineProperty(exports, "World", { enumerable: true, get: function () { return World_1.World; } });
var Raycast_1 = require("./world/Raycast");
Object.defineProperty(exports, "raycast", { enumerable: true, get: function () { return Raycast_1.raycast; } });
// Inventory
var Window_1 = require("./inventory/Window");
Object.defineProperty(exports, "Window", { enumerable: true, get: function () { return Window_1.Window; } });
var Item_1 = require("./inventory/Item");
Object.defineProperty(exports, "Item", { enumerable: true, get: function () { return Item_1.Item; } });
var buildPlanner_1 = require("./utils/buildPlanner");
Object.defineProperty(exports, "createBuildPlanSteps", { enumerable: true, get: function () { return buildPlanner_1.createBuildPlanSteps; } });
// Pathfinder & Utils
var SimplePathfinder_1 = require("./pathfinder/SimplePathfinder");
Object.defineProperty(exports, "findPath", { enumerable: true, get: function () { return SimplePathfinder_1.findPath; } });
var Logger_1 = require("./utils/Logger");
Object.defineProperty(exports, "Logger", { enumerable: true, get: function () { return Logger_1.Logger; } });
//# sourceMappingURL=index.js.map