import express from "express";
import cors from "cors";
import path from "path";
import apiRoutes from "./api/routes";
import { manager } from "./managers";

const app = express();

// Middleware Ayarları
app.use(cors());
app.use(express.json()); // Worker'dan gelen JSON body'yi okumak için ŞART

// 🚨 KRİTİK SIRALAMA:
// 1. API rotaları statik dosyalardan ÖNCE tanımlanmalı!
app.use("/api", apiRoutes);

// 2. Dashboard ve Web Arayüzü Statik Dosyaları
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// 3. SPA Fallback: API dışındaki tüm isteklere Dashboard (index.html) bas
app.get("*", (_, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, () => {
    console.log(`[GooberCraft Master] Port ${PORT} üzerinde aktif.`);

    // Master sunucu ayağa kalktığında ana node'u kaydet
    manager.nodes.registerNode({
        id: "master-node-1",
        name: "Master Node (Render)",
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        maxBots: 10
    });

    console.log("[GooberCraft:Master] Varsayılan Master Node sisteme kaydedildi.");
});