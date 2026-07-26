import { Router } from "express";
import { manager } from "../managers";

const router = Router();

// GET: /api/nodes -> Web panelinin aktif tüm Node'ları çekmesi için
router.get("/nodes", (_, res) => {
    return res.json({ 
        success: true, 
        nodes: manager.nodes.getAllNodes() 
    });
});

// POST: /api/nodes/register -> Worker'ların Master'a kaydolduğu kritik nokta
router.post("/nodes/register", (req, res) => {
    const { id, name, url, maxBots } = req.body;

    if (!id || !url) {
        return res.status(400).json({ 
            error: "Eksik Node Bilgisi! 'id' ve 'url' alanları zorunludur." 
        });
    }

    // Worker'ı Master Cluster yöneticisine kaydet
    manager.nodes.registerNode({
        id,
        name: name || "Worker Node (Render)",
        url,
        maxBots: maxBots || 10
    });

    console.log(`[GooberCraft:Master] Yeni Worker bağlandı: ${name} (${url})`);

    return res.json({
        success: true,
        message: `${name} başarıyla Master Cluster'a kaydedildi.`
    });
});

export default router;