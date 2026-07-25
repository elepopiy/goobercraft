import { Request, Response } from "express";
import { createBot } from "../../createBot";
import { manager } from "../../managers";

export class BotController {
  // BOT OLUŞTURMA
  public static async create(req: Request, res: Response) {
    const { username, host, port, ownerToken } = req.body;

    if (!username || !host) {
      return res.status(400).json({ success: false, message: "Kullanıcı adı ve IP zorunludur!" });
    }

    try {
      const bot = await createBot({ username, host, port });
      
      // Sahiplik token'ını bot verisine işle
      const botData = manager.bots.get(bot.getId());
      if (botData) {
        (botData as any).ownerToken = ownerToken || "anonymous";
      }

      return res.json({
        success: true,
        message: `'${username}' botu başarıyla başlatıldı!`,
        botId: bot.getId()
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // BOT DURDURMA / SİLME
  public static async stop(req: Request, res: Response) {
    const { id, ownerToken } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Bot ID zorunludur!" });
    }

    const botData = manager.bots.get(id);
    if (!botData) {
      return res.status(404).json({ success: false, message: "Bot bulunamadı veya zaten çevrimdışı." });
    }

    // SAHİPLİK KONTROLÜ
    if ((botData as any).ownerToken && (botData as any).ownerToken !== ownerToken) {
      return res.status(403).json({
        success: false,
        message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
      });
    }

    // Botu durdur ve ağdan çıkar
    manager.bots.remove(id);

    return res.json({
      success: true,
      message: `'${botData.username}' botu başarıyla durduruldu.`
    });
  }

  public static getBots(req: Request, res: Response) {
    return res.json({
      success: true,
      bots: manager.bots.getAll()
    });
  }
}