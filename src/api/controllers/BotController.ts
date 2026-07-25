import { Request, Response } from "express";
import { NodeController } from "./NodeController";
import { createBot } from "../../createBot"; // createBot fabrika fonksiyonunun yolu

export class BotController {
    
    public static getBots(req: Request, res: Response) {
        // Master Manager üzerindeki bot listesini döndürür
        const { manager } = require("../managers");
        
        res.json({
            success: true,
            bots: manager.bots.getAll()
        });
    }

    public static async createBot(req: Request, res: Response) {
        const { username, host, port } = req.body;

        if (!host) {
            return res.status(400).json({
                success: false,
                message: "Minecraft Sunucu IP/Host adresi zorunludur!"
            });
        }

        try {
            // Gerçek GooberCraft Bot'unu oluştur ve başlat.
            // Bu fonksiyon otomatik olarak en uygun Node'u seçecek ve ona bağlayacak.
            const bot = await createBot({
                username: username || `Goob_${Math.floor(Math.random() * 1000)}`,
                host: host,
                port: port ? Number(port) : 25565
            });

            const assignedNodeId = bot.getNodeId() ?? "local";

            res.json({
                success: true,
                message: `'${bot.username}' botu başarıyla '${assignedNodeId}' node'unda başlatıldı!`,
                bot: {
                    id: bot.getId(),
                    username: bot.username,
                    nodeId: assignedNodeId,
                    online: true,
                    createdAt: bot.getCreatedAt()
                }
            });
        } catch (error: any) {
            console.error("[BotController] Bot oluşturma hatası:", error);
            res.status(500).json({
                success: false,
                message: error.message || "Bot başlatılırken bir hata oluştu."
            });
        }
    }

    public static stopBot(req: Request, res: Response) {
        const { id } = req.body;
        const { manager } = require("../managers");

        const botState = manager.bots.get(id);
        if (botState) {
            // Eğer bot nesnesine erişiminiz varsa bot.end() çağrılabilir
            manager.bots.remove(id);
            return res.json({
                success: true,
                message: "Bot başarıyla durduruldu."
            });
        }

        res.json({
            success: false,
            message: "Bot bulunamadı."
        });
    }
}