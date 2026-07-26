import { Router } from "express";
import { manager } from "../managers";

const router = Router();

// Worker Node'ların kendini Master'a kaydetmesi için:
router.post("/nodes/register", (req, res) => {
    const { id, name, url, maxBots } = req.body;

    if (!id || !url) {
        return res.status(400).json({ error: "Eksik Node Bilgisi! 'id' ve 'url' zorunludur." });
    }

    // Gelen Worker'ı Master Manager sistemine kaydet
    manager.nodes.registerNode({ 
        id, 
        name: name || "Worker Node (Render)", 
        url, 
        maxBots: maxBots || 10 
    });

    console.log(`[GooberCraft:Master] Yeni Worker Node sisteme bağlandı: ${name} (${url})`);

    return res.json({ 
        success: true, 
        message: `${name} başarıyla Master Cluster'a kaydedildi.` 
    });
});

// Tüm aktif Node'ları paneline çekmek istersen:
router.get("/nodes", (_, res) => {
    return res.json({ nodes: manager.nodes.getAllNodes() });
});

export default router;