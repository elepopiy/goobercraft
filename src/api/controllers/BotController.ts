import { Request, Response } from "express";
import { NodeController } from "./NodeController";
import { BotManager, ManagedBot } from "../../managers/BotManager";

export class BotController {
    public static botManager = new BotManager();

    public static getBots(req: Request, res: Response) {
        res.json({
            success: true,
            bots: BotController.botManager.getAll()
        });
    }

    public static createBot(req: Request, res: Response) {
        const { username, host, port } = req.body;

        // 1. En uygun / en boş Node'u bul
        const availableNode = NodeController.nodeManager.getAvailableNode();

        if (!availableNode) {
            return res.status(400).json({
                success: false,
                message: "Müsait aktif Node (Server) bulunamadı veya tüm serverlar dolu (Max 10 bot)!"
            });
        }

        // 2. Botu en boş olan Node'a bağla
        const newBot: ManagedBot = {
            id: `bot_${Date.now()}`,
            username: username || `Goob_${Math.floor(Math.random() * 1000)}`,
            nodeId: availableNode.id,
            online: true,
            createdAt: Date.now()
        };

        BotController.botManager.add(newBot);
        availableNode.currentBots += 1;

        res.json({
            success: true,
            message: `Bot '${newBot.username}' başarıyla '${availableNode.name}' sunucusuna eklendi!`,
            bot: newBot
        });
    }

    public static stopBot(req: Request, res: Response) {
        const { id } = req.body;
        const removed = BotController.botManager.remove(id);

        res.json({
            success: removed,
            message: removed ? "Bot durduruldu." : "Bot bulunamadı."
        });
    }
}