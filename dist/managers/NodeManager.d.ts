export interface NodeInfo {
    id: string;
    name: string;
    url: string;
    currentBots: number;
    maxBots: number;
    online: boolean;
    lastPing: number;
}
export declare class NodeManager {
    private nodes;
    /**
     * Sisteme yeni bir Node ekler veya var olanı günceller
     */
    registerNode(nodeData: Partial<NodeInfo> & {
        id: string;
        url: string;
    }): NodeInfo;
    /**
     * En az bota sahip ve 10 bot limitini aşmamış en uygun Node'u döner
     */
    getAvailableNode(): NodeInfo | null;
    /**
     * Belirtilen Node'un bot sayısını artırır
     */
    incrementBotCount(nodeId: string): void;
    /**
     * Belirtilen Node'un bot sayısını eksiltir
     */
    decrementBotCount(nodeId: string): void;
    /**
     * Tüm Node'ların listesini döner (Master Paneli için)
     */
    getAllNodes(): NodeInfo[];
    /**
     * ID'ye göre Node getirir
     */
    getNode(id: string): NodeInfo | undefined;
    /**
     * Node'u sistemden siler
     */
    removeNode(id: string): boolean;
}
//# sourceMappingURL=NodeManager.d.ts.map