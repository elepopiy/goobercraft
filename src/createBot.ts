import { Bot } from "./Bot";
import { manager } from "./managers";
import { BotOptions, ResolvedBotOptions } from "./utils/types";

const DEFAULTS: Omit<
  ResolvedBotOptions,
  "host" | "username" | "password" | "profile"
> = {
  port: 25565,
  auth: "offline",
  version: "auto",
  viewDistance: 8,
  checkTimeoutInterval: 30000,
  respawnOnDeath: true,
};

/**
 * CANLI Bot instance kayıt defteri.
 *
 * manager.bots (BotManager) sadece DÜZ VERİ (id/username/nodeId/...) tutar — .end()
 * gibi metodları olan gerçek Bot nesnesi değildir. Terminate/stop işleminin fiilen
 * bağlantıyı kesebilmesi için gerçek Bot instance'larını burada, id -> Bot şeklinde
 * ayrı tutuyoruz.
 */
const liveBots = new Map<string, Bot>();

export function getBotInstance(id: string): Bot | undefined {
  return liveBots.get(id);
}

export function registerBotInstance(id: string, bot: Bot): void {
  liveBots.set(id, bot);
}

export function removeBotInstance(id: string): boolean {
  return liveBots.delete(id);
}

export function getLiveBotCount(): number {
  return liveBots.size;
}

function resolveOptions(options: BotOptions): ResolvedBotOptions {
  if (!options.host)
    throw new Error("GooberCraft: 'host' zorunludur.");

  if (!options.username)
    throw new Error("GooberCraft: 'username' zorunludur.");

  return {
    host: options.host,
    username: options.username,
    password: options.password,
    port: options.port ?? DEFAULTS.port,
    auth: options.auth ?? DEFAULTS.auth,
    version: options.version ?? DEFAULTS.version,
    viewDistance: options.viewDistance ?? DEFAULTS.viewDistance,
    checkTimeoutInterval: options.checkTimeoutInterval ?? DEFAULTS.checkTimeoutInterval,
    respawnOnDeath: options.respawnOnDeath ?? DEFAULTS.respawnOnDeath,
    profile: options.profile ?? "stable",
  };
}

/**
 * GooberCraft Bot Fabrika Fonksiyonu
 */
export async function createBot(options: BotOptions): Promise<Bot> {
  const resolved = resolveOptions(options);

  // 1. En uygun Node'u seç (En boş olanı getirir)
  const node = manager.nodes.getAvailableNode();
  const bot = new Bot(resolved);

  // Gerçek instance'ı hemen kayıt defterine ekle — stop() bunu bulup .end() çağırabilsin
  registerBotInstance(bot.getId(), bot);

  if (node) {
    bot.setNodeId(node.id);

    // Node üzerindeki bot sayacını artır
    manager.nodes.incrementBotCount(node.id);

    const nodeUrl = (node as any).url;

    // Yerel node tespiti: "local", "master-node-1" veya localhost adresleri HTTP isteği atmaz
    const isLocalNode =
      node.id === "local" ||
      node.id === "master-node-1" ||
      !nodeUrl ||
      nodeUrl.includes("localhost") ||
      nodeUrl.includes("127.0.0.1");

    // 2. Uzak İşçi (Worker) Node ise Webhook/HTTP ile tetikle
    if (!isLocalNode) {
      try {
        const response = await fetch(`${nodeUrl}/api/bots/spawn`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: bot.getId(),
            options: resolved
          })
        });

        if (!response.ok) {
          throw new Error(`Node (${node.id}) yanıt vermedi: ${response.statusText}`);
        }
      } catch (error) {
        console.error(`[GooberCraft] Node ile iletişim kurulamadı, local olarak başlatılıyor:`, error);
        bot.connect();
      }
    } else {
      // Yerel Node ise doğrudan soket bağlantısını başlat
      bot.connect();
    }
  } else {
    // Müsait Node bulunamadıysa varsayılan olarak yerelde çalıştır
    bot.setNodeId("local");
    bot.connect();
  }

  const assignedNodeId: string = bot.getNodeId() || "local";

  // 3. Master durum kaydı
  manager.bots.add({
    id: bot.getId(),
    username: resolved.username,
    nodeId: assignedNodeId,
    online: false,
    createdAt: bot.getCreatedAt(),
    host: resolved.host,
    port: resolved.port,
    profile: resolved.profile ?? "stable"
  } as any);

  const markOffline = () => {
    const record = manager.bots.get(bot.getId());
    if (record) {
      (record as any).online = false;
    }
  };

  bot.on("login", () => {
    const record = manager.bots.get(bot.getId());
    if (record) {
      (record as any).online = true;
    }
  });

  // Bot kendi kendine düşerse (disconnect/kick/hata) kayıt defterinden de düşür,
  // aksi halde "hayalet" instance'lar bellekte birikir.
  bot.once("end", () => {
    markOffline();
    removeBotInstance(bot.getId());
  });

  bot.on("_raw_disconnect", markOffline);
  bot.on("_raw_error", markOffline);
  bot.on("_raw_kick", markOffline);
  bot.on("_raw_end", markOffline);

  return bot;
}