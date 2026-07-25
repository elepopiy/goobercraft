export interface SystemBot {
    id: string;
    nodeId: string;
    username: string;
    host: string;
    ownerToken: string;
    isSystem: true;
}
export declare function getSystemBotCount(maxBots: number): number;
export declare function isSystemBotId(id: string): boolean;
export declare function getSystemBotsForNode(node: {
    id: string;
    maxBots: number;
}): SystemBot[];
//# sourceMappingURL=systemBots.d.ts.map