import { Router } from "express";
import { manager } from "../managers";
import apiRoutes from "./routes";

const router = Router();

// GET: /api/nodes -> Web panelinin aktif Node listesini çekmesi için
router.get("/nodes", (_, res) => {
    return res.json({ 
        success: true, 
        nodes: manager.nodes.getAllNodes() 
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
    manager.nodes.registerNode({
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

router.use(apiRoutes);

export default router;