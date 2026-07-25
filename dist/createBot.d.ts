import { Bot } from "./Bot";
import { BotOptions } from "./utils/types";
export declare function getBotInstance(id: string): Bot | undefined;
export declare function registerBotInstance(id: string, bot: Bot): void;
export declare function removeBotInstance(id: string): boolean;
export declare function getLiveBotCount(): number;
/**
 * GooberCraft Bot Fabrika Fonksiyonu
 */
export declare function createBot(options: BotOptions): Promise<Bot>;
//# sourceMappingURL=createBot.d.ts.map