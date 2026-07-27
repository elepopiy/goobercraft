import express, { Express } from "express";
import cors from "cors";
import path from "path";
import apiRoutes from "./api/router";
import { manager } from "./managers";

// ==========================================
// Express / Server Kurulumu
// ==========================================

/**
 * Express uygulamasını yapılandırır ve döndürür.
 */
export function createServer(): Express {
  const app = express();

  app.use(cors());
  app.use(express.json()); // Worker verilerini okumak için

  // 1. API Rotaları (Öncelikli)
  app.use("/api", apiRoutes);

  // 2. Statik Web Paneli Dosyaları
  const publicPath = path.join(process.cwd(), "public");
  app.use(express.static(publicPath));

  // 3. SPA Fallback (Diğer tüm frontend rotaları için)
  app.get("*", (req, res) => {
    // API çağrıları yanlışlıkla buraya düşerse 404 döndür
    if (req.path.startsWith("/api")) {
      return res.status(404).json({ error: "API rotası bulunamadı." });
    }

    res.sendFile(path.join(publicPath, "index.html"), (err) => {
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
export function startServer(port?: number) {
  const app = createServer();
  const PORT = port || Number(process.env.PORT) || 10000;
  const MAX_BOTS = Number(process.env.MAX_BOTS || 100);

  const server = app.listen(PORT, () => {
    console.log(`[GooberCraft Master] Port ${PORT} üzerinde aktif.`);

    // Master'ın kendi lokal node'unu kaydet
    manager.nodes.registerNode({
      id: "master-node-1",
      name: "Master Node (Render)",
      url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
      maxBots: MAX_BOTS,
    });
  });

  // Render ve Cloud ortamlarında temiz kapanma (Graceful Shutdown)
  const handleShutdown = (signal: string) => {
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
export { createBot } from "./createBot";
export { Bot } from "./Bot";

// Core System & Managers (Cluster / Multi-node yönetimi için)
export { EventBus } from "./core/EventBus";
export { PluginManager } from "./core/PluginManager";

// Entities & World
export { Entity } from "./entity/Entity";
export { PlayerEntity } from "./entity/PlayerEntity";
export { World } from "./world/World";
export { raycast } from "./world/Raycast";

// Inventory
export { Window } from "./inventory/Window";
export { Item } from "./inventory/Item";
export { createBuildPlanSteps } from "./utils/buildPlanner";

// Pathfinder & Utils
export { findPath } from "./pathfinder/SimplePathfinder";
export { Logger } from "./utils/Logger";

// Types
export type {
  BotOptions,
  ResolvedBotOptions,
  AuthMode,
  ChatMessage,
  EntityData,
  PlayerData,
  ItemStack,
  ControlStates,
  ControlName,
  RaycastResult,
  WeatherState,
  ExperienceState,
} from "./utils/types";

export type { GooberPlugin, PluginFactory } from "./core/PluginManager";