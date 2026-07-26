import express from "express";
import cors from "cors";
import path from "path";
import api from "./api/routes";
import { manager } from "./managers"; // Global manager importu

const app = express();

app.use(cors());
app.use(express.json());

// ============================================================
// 1. KRİTİK DÜZELTME: /api YOLU STATİK DOSYALARDAN ÖNE ALINDI!
// ============================================================
app.use("/api", api);

// 2. Statik dosyalar ve web arayüzü servis paneli
const publicPath = path.join(process.cwd(), "public");
app.use(express.static(publicPath));

// 3. Fallback Route: API dışındaki bilinmeyen yollarda index.html döndür
app.get("*", (_, res) => {
    res.sendFile(path.join(publicPath, "index.html"));
});

const PORT = Number(process.env.PORT) || 10000;

app.listen(PORT, () => {
    console.log(`GooberCraft Master listening on port ${PORT}`);

    // Sunucu ayağa kalktığında varsayılan Master Node'u sisteme kaydet
    manager.nodes.registerNode({
        id: "master-node-1",
        name: "Master Node (Render)",
        url: process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`,
        maxBots: 10
    });

    console.log("[GooberCraft:Master] Varsayılan Node sisteme başarıyla kaydedildi.");
});