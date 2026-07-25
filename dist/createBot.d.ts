import { Bot } from "./Bot";
import { BotOptions } from "./utils/types";
import { BotManager } from "./managers/BotManager";
import { NodeManager } from "./managers/NodeManager";
import { TaskManager } from "./managers/TaskManager";
export declare const nodeManager: NodeManager;
export declare const botManager: BotManager;
export declare const taskManager: TaskManager;
/**
 * GooberCraft Bot Factory
 */
export declare function createBot(options: BotOptions): Bot;
//# sourceMappingURL=createBot.d.ts.map