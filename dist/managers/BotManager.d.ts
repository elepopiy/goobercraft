import { BotInfo } from "../types/BotInfo";
export declare class BotManager {
    private readonly bots;
    add(bot: BotInfo): void;
    remove(id: string): void;
    get(id: string): BotInfo | undefined;
    getAll(): BotInfo[];
}
//# sourceMappingURL=BotManager.d.ts.map