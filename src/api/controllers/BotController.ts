import { Request, Response } from "express";
import { createBot } from "../../createBot";
import { manager } from "../../managers";
import { nodesList } from "../routes/nodes";

export class BotController {
  public static async create(req: Request, res: Response) {
    const { username, host, port, ownerToken } = req.body;

    // 1. Temel Girdi Kontrolü
    if (!username || !host) {
      return res.status(400).json({ success: false, message: "Kullanıcı adı ve IP zorunludur!" });
    }

    const userToken = ownerToken || "anonymous";
    const allBots = manager.bots.getAll();

    // 2. KİŞİ BAŞI BOT LİMİTİ KONTROLÜ (Maksimum 3 Bot)
    const userBotsCount = allBots.filter((b: any) => b.ownerToken === userToken).length;
    
    if (userBotsCount >= 3) {
      return res.status(403).json({
        success: false,
        message: "⛔ Bot limitine ulaştınız! Aynı kişi en fazla 3 bot ekleyebilir."
      });
    }

    // 3. EN BOŞ RACK'İ BULMA (Yük Dengeleme)
    let selectedNode: any = null;
    let minBotCount = Infinity;

    for (const node of nodesList) {
      const nodeBotsCount = allBots.filter((b: any) => b.nodeId === node.id || b.node_id === node.id).length;
      if (nodeBotsCount < node.maxBots && nodeBotsCount < minBotCount) {
        minBotCount = nodeBotsCount;
        selectedNode = node;
      }
    }

    // 4. GLOBAL KAPASİTE KONTROLÜ (Tüm Rack'ler 100/100 Doluysa)
    if (!selectedNode) {
      return res.status(400).json({
        success: false,
        message: "⛔ Tüm DataCenter Rack'leri tamamen dolu (100/100)! Biri bot çıkarana kadar yeni bot eklenemez."
      });
    }

    try {
      // Botu seçilen en boş Rack üzerine konuşlandır
      const bot = await createBot({ username, host, port });
      const botData = manager.bots.get(bot.getId());

      if (botData) {
        (botData as any).nodeId = selectedNode.id;
        (botData as any).ownerToken = userToken;
      }

      return res.json({
        success: true,
        message: `'${username}' botu ${selectedNode.name} üzerine konuşlandırıldı! (${userBotsCount + 1}/3 botunuz aktif)`,
        botId: bot.getId(),
        nodeId: selectedNode.id
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

    // SAHİPLİK KONTROLÜ (Sadece ekleyen silebilir)
    if ((botData as any).ownerToken && (botData as any).ownerToken !== ownerToken) {
      return res.status(403).json({
        success: false,
        message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
      });
    }

    manager.bots.remove(id);

    return res.json({
      success: true,
      message: `'${botData.username}' botu durduruldu. Sizin için +1 bot hakkı tekrar açıldı.`
    });
  }

  // BOTS LİSTELEME
  public static getBots(req: Request, res: Response) {
    return res.json({
      success: true,
      bots: manager.bots.getAll()
    });
  }
}