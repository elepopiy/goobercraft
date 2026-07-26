import express from "express";
import cors from "cors";
import path from "path";
import apiRoutes from "./api/routes";
import { manager } from "./managers";

const app = express();

app.use(cors());
app.use(express.json()); // Worker'dan gelen JSON verilerini okumak için ŞART

// 🚨 KRİTİK SIRALAMA:
// 1. API Rotaları (Statik ve HTML yakalayıcısından ÖNCE gelmek zorunda)
app.use("/api", apiRoutes);

// 2. Web Paneli Statik Dosyaları
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// 3. SPA Fallback (API dışındaki her istek Dashboard HTML'ine gider)
app.get("*", (_, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, () => {
    console.log(`[GooberCraft Master] Port ${PORT} üzerinde aktif.`);

    // Master'ın kendi lokal node'unu kaydet
    manager.nodes.registerNode({
        id: "master-node-1",
        name: "Master Node (Render)",
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        maxBots: 10
    });
});