import { Bot } from "./Bot";
import { manager } from "./managers";

import {
  BotOptions,
  ResolvedBotOptions
} from "./utils/types";

const DEFAULTS: Omit<
  ResolvedBotOptions,
  "host" | "username" | "password"
> = {
  port: 25565,
  auth: "offline",
  version: "1.20.4",
  viewDistance: 8,
  checkTimeoutInterval: 30000,
  respawnOnDeath: true,
};

function resolveOptions(
  options: BotOptions
): ResolvedBotOptions {

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
    viewDistance:
      options.viewDistance ??
      DEFAULTS.viewDistance,
    checkTimeoutInterval:
      options.checkTimeoutInterval ??
      DEFAULTS.checkTimeoutInterval,
    respawnOnDeath:
      options.respawnOnDeath ??
      DEFAULTS.respawnOnDeath,
  };
}

/**
 * GooberCraft Bot Factory
 */
export async function createBot(options: BotOptions): Promise<Bot> {
  const resolved = resolveOptions(options);

  // 1. En uygun Node'u bul
  const node = manager.nodes.getAvailableNode();
  const bot = new Bot(resolved);

  if (node) {
    bot.setNodeId(node.id);

    // 2. Eğer Node uzak bir Node ise (Local değilse) ona HTTP/Webhook isteği at
    if (node.id !== "local" && node.url) {
      try {
        const response = await fetch(`${node.url}/api/bots/spawn`, {
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

        console.log(`[GooberCraft] Bot '${resolved.username}' başarıyla ${node.id} düğümüne gönderildi.`);
      } catch (error) {
        console.error(`[GooberCraft] Node ile iletişim kurulamadı, local olarak başlatılıyor:`, error);
        bot.connect(); // İletişim koparsa fallback olarak local başlat
      }
    } else {
      // Node local ise doğrudan bu süreçte çalıştır
      bot.connect();
    }
  } else {
    // Uygun Node yoksa varsayılan local çalıştır
    bot.connect();
  }

  // 3. Master state kaydı
  manager.bots.add({
    id: bot.getId(),
    username: resolved.username,
    nodeId: bot.getNodeId() ?? "local",
    online: true,
    createdAt: bot.getCreatedAt()
  });

  return bot;
}