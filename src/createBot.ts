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
export function createBot(
  options: BotOptions
): Bot {

  const resolved =
    resolveOptions(options);

  // Gelecekte en uygun worker burada seçilecek.
  const node =
    manager.nodes.getAvailableNode();

  const bot =
    new Bot(resolved);

  // Şimdilik local olarak kayıt ediyoruz.
  manager.bots.add({
    id: bot.getId(),
    username: resolved.username,
    nodeId: node?.id ?? "local",
    online: true,
    createdAt: bot.getCreatedAt()
  });

  bot.connect();

  return bot;

}