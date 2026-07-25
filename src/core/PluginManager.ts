import { Logger } from "../utils/Logger";

export interface GooberPlugin {
  name: string;
  apply: (bot: any) => void;
  dispose?: (bot: any) => void;
}

export type PluginFactory = (bot: any) => void;

/**
 * PluginManager, bot.loadPlugin(plugin) çağrısıyla eklenen eklentileri
 * yönetir. Bir plugin ya doğrudan bir fonksiyon (bot) => void olabilir
 * ya da { name, apply, dispose } şeklinde bir obje olabilir.
 */
export class PluginManager {
  private loaded: Map<string, GooberPlugin> = new Map();
  private anonymousCount = 0;

  load(bot: any, plugin: GooberPlugin | PluginFactory): void {
    const normalized: GooberPlugin =
      typeof plugin === "function"
        ? { name: plugin.name || `anonymous-plugin-${++this.anonymousCount}`, apply: plugin }
        : plugin;

    if (this.loaded.has(normalized.name)) {
      Logger.warn("PluginManager", `'${normalized.name}' zaten yüklü, tekrar yüklenmiyor.`);
      return;
    }

    try {
      normalized.apply(bot);
      this.loaded.set(normalized.name, normalized);
      Logger.info("PluginManager", `'${normalized.name}' eklentisi yüklendi.`);
    } catch (err) {
      Logger.error("PluginManager", `'${normalized.name}' eklentisi yüklenirken hata:`, err);
      throw err;
    }
  }

  unload(bot: any, name: string): boolean {
    const plugin = this.loaded.get(name);
    if (!plugin) return false;
    plugin.dispose?.(bot);
    this.loaded.delete(name);
    Logger.info("PluginManager", `'${name}' eklentisi kaldırıldı.`);
    return true;
  }

  list(): string[] {
    return Array.from(this.loaded.keys());
  }

  disposeAll(bot: any): void {
    for (const [name, plugin] of this.loaded) {
      try {
        plugin.dispose?.(bot);
      } catch (err) {
        Logger.error("PluginManager", `'${name}' dispose edilirken hata:`, err);
      }
    }
    this.loaded.clear();
  }
}
