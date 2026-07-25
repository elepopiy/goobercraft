export interface NodeInfo {
    id: string;
    name: string;
    maxBots: number;
    currentBots: number;
    online: boolean;
}
export declare class NodeManager {
    private readonly nodes;
    add(node: NodeInfo): void;
    remove(id: string): boolean;
    get(id: string): NodeInfo | undefined;
    getAll(): NodeInfo[];
    count(): number;
    exists(id: string): boolean;
    clear(): void;
    getAvailableNode(): NodeInfo | undefined;
}
//# sourceMappingURL=NodeManager.d.ts.map