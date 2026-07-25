export interface ManagedBot {
    id: string;
    username: string;
    nodeId: string;
    online: boolean;
    createdAt: number;
}
export declare class BotManager {
    private readonly bots;
    add(bot: ManagedBot): void;
    remove(id: string): boolean;
    get(id: string): ManagedBot | undefined;
    getAll(): ManagedBot[];
    clear(): void;
    count(): number;
    exists(id: string): boolean;
}
//# sourceMappingURL=BotManager.d.ts.map