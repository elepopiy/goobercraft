"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PluginManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * PluginManager, bot.loadPlugin(plugin) çağrısıyla eklenen eklentileri
 * yönetir. Bir plugin ya doğrudan bir fonksiyon (bot) => void olabilir
 * ya da { name, apply, dispose } şeklinde bir obje olabilir.
 */
class PluginManager {
    loaded = new Map();
    anonymousCount = 0;
    load(bot, plugin) {
        const normalized = typeof plugin === "function"
            ? { name: plugin.name || `anonymous-plugin-${++this.anonymousCount}`, apply: plugin }
            : plugin;
        if (this.loaded.has(normalized.name)) {
            Logger_1.Logger.warn("PluginManager", `'${normalized.name}' zaten yüklü, tekrar yüklenmiyor.`);
            return;
        }
        try {
            normalized.apply(bot);
            this.loaded.set(normalized.name, normalized);
            Logger_1.Logger.info("PluginManager", `'${normalized.name}' eklentisi yüklendi.`);
        }
        catch (err) {
            Logger_1.Logger.error("PluginManager", `'${normalized.name}' eklentisi yüklenirken hata:`, err);
            throw err;
        }
    }
    unload(bot, name) {
        const plugin = this.loaded.get(name);
        if (!plugin)
            return false;
        plugin.dispose?.(bot);
        this.loaded.delete(name);
        Logger_1.Logger.info("PluginManager", `'${name}' eklentisi kaldırıldı.`);
        return true;
    }
    list() {
        return Array.from(this.loaded.keys());
    }
    disposeAll(bot) {
        for (const [name, plugin] of this.loaded) {
            try {
                plugin.dispose?.(bot);
            }
            catch (err) {
                Logger_1.Logger.error("PluginManager", `'${name}' dispose edilirken hata:`, err);
            }
        }
        this.loaded.clear();
    }
}
exports.PluginManager = PluginManager;
//# sourceMappingURL=PluginManager.js.map