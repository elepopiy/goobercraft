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
export declare class PluginManager {
    private loaded;
    private anonymousCount;
    load(bot: any, plugin: GooberPlugin | PluginFactory): void;
    unload(bot: any, name: string): boolean;
    list(): string[];
    disposeAll(bot: any): void;
}
//# sourceMappingURL=PluginManager.d.ts.map