import { Request, Response } from "express";
import { createBot } from "../../createBot";
import { manager } from "../../managers";
import { nodesList } from "../routes/nodes";
import { getSystemBotCount, getSystemBotsForNode, isSystemBotId } from "../../utils/systemBots";

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

    // 3. EN BOŞ RACK'İ BULMA (Yük Dengeleme) - sistem botları da kapasiteye dahil edilir
    let selectedNode: any = null;
    let minBotCount = Infinity;

    for (const node of nodesList) {
      const realBotsInNode = allBots.filter((b: any) => b.nodeId === node.id || b.node_id === node.id).length;
      const systemBotsInNode = getSystemBotCount(node.maxBots);
      const nodeBotsCount = realBotsInNode + systemBotsInNode;

      if (nodeBotsCount < node.maxBots && nodeBotsCount < minBotCount) {
        minBotCount = nodeBotsCount;
        selectedNode = node;
      }
    }

    // 4. GLOBAL KAPASİTE KONTROLÜ
    if (!selectedNode) {
      return res.status(400).json({
        success: false,
        message: "⛔ Tüm DataCenter Rack'leri tamamen dolu! Biri bot çıkarana kadar yeni bot eklenemez."
      });
    }

    try {
      // Botu seçilen en boş Rack üzerine konuşlandır
      const botInstance = await createBot({ username, host, port });

      // Bot ID tespiti
      const targetId = typeof botInstance.getId === 'function' ? botInstance.getId() : (botInstance as any).id;
      const botData = manager.bots.get(targetId) || botInstance;

      if (botData) {
        (botData as any).id = targetId;
        (botData as any).nodeId = selectedNode.id;
        (botData as any).ownerToken = userToken;
        (botData as any).username = username;
        (botData as any).host = host;
      }

      return res.json({
        success: true,
        message: `'${username}' botu ${selectedNode.name} üzerine konuşlandırıldı! (${userBotsCount + 1}/3 botunuz aktif)`,
        botId: targetId,
        nodeId: selectedNode.id
      });
    } catch (error: any) {
      return res.status(500).json({ success: false, message: error.message || "Bot başlatılamadı." });
    }
  }

  // BOT DURDURMA / SİLME - GERÇEK KONTROL & TAM KAPATMA
  public static async stop(req: Request, res: Response) {
    const { id, ownerToken } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Bot ID zorunludur!" });
    }

    // 0. SİSTEM BOTU KORUMASI - id ne olursa olsun, ne istemciden ne başka bir yoldan durdurulamaz
    if (isSystemBotId(id)) {
      return res.status(403).json({
        success: false,
        message: "⛔ Bu bir Sistem Botu! Sistem korumalı botlar durdurulamaz veya silinemez."
      });
    }

    // 1. Botu ID üzerinden bul
    let botData: any = manager.bots.get(id);

    // Eğer ID doğrudan uyuşmadıysa esnek eşleşme yap
    if (!botData) {
      const allBots = manager.bots.getAll();
      botData = allBots.find((b: any) => b.id === id || b._id === id || b.botId === id);
    }

    if (!botData) {
      return res.status(404).json({ success: false, message: "Bot bulunamadı veya zaten kapatılmış." });
    }

    // 2. SAHİPLİK KONTROLÜ (Sadece oluşturan silebilir)
    if (botData.ownerToken && botData.ownerToken !== ownerToken) {
      return res.status(403).json({
        success: false,
        message: "⛔ Bu botu sadece oluşturan kişi durdurabilir!"
      });
    }

    try {
      // 3. MINEFLAYER BOTUNU TEMİZCE DURDUR (Oto-tekrar bağlanmayı engelle)
      if (typeof botData.stop === 'function') {
        botData.stop(); // Oto-reconnect sayacını durduran özel metot
      } else if (typeof botData.quit === 'function') {
        botData.quit();
      } else if (typeof botData.end === 'function') {
        botData.end();
      } else if (botData.bot && typeof botData.bot.stop === 'function') {
        botData.bot.stop();
      } else if (botData.bot && typeof botData.bot.end === 'function') {
        botData.bot.end();
      }

      // 4. BOTS MANAGER BELLEĞİNDEN TAMAMEN KALDIR
      const targetId = botData.id || id;
      manager.bots.remove(targetId);

      return res.json({
        success: true,
        message: `'${botData.username || 'Bot'}' durduruldu ve kapatıldı. Sizin için +1 bot hakkı açıldı.`
      });
    } catch (err: any) {
      // Yine de listeden sil
      manager.bots.remove(id);
      return res.json({
        success: true,
        message: "Bot zorla kapatıldı ve listeden silindi."
      });
    }
  }

  // BOTS LİSTELEME - gerçek botlar + backend'in ürettiği sistem botları (isSystem:true)
  public static getBots(req: Request, res: Response) {
    const realBots = manager.bots.getAll().map((b: any) => ({
      id: b.id || b._id || b.botId,
      username: b.username,
      host: b.host,
      nodeId: b.nodeId || b.node_id,
      ownerToken: b.ownerToken,
      isSystem: false
    }));

    const systemBots = nodesList.flatMap((node: any) => getSystemBotsForNode(node));

    return res.json({
      success: true,
      bots: [...systemBots, ...realBots]
    });
  }
}