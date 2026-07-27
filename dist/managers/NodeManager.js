"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeManager = void 0;
class NodeManager {
    nodes = new Map();
    /**
     * Sisteme yeni bir Node ekler veya var olanı günceller
     */
    registerNode(nodeData) {
        const existing = this.nodes.get(nodeData.id);
        const node = {
            id: nodeData.id,
            name: nodeData.name || nodeData.id,
            url: nodeData.url,
            currentBots: existing ? existing.currentBots : (nodeData.currentBots || 0),
            maxBots: nodeData.maxBots || 100, // Varsayılan limit 100 bot
            online: true,
            lastPing: Date.now()
        };
        this.nodes.set(node.id, node);
        console.log(`[NodeManager] Node kaydedildi/güncellendi: ${node.id} (${node.currentBots}/${node.maxBots})`);
        return node;
    }
    /**
     * En az bota sahip ve 10 bot limitini aşmamış en uygun Node'u döner
     */
    getAvailableNode() {
        const activeNodes = Array.from(this.nodes.values()).filter((node) => node.online && node.currentBots < node.maxBots);
        if (activeNodes.length === 0) {
            return null; // Müsait veya kapasitesi boş Node yok
        }
        // Bot sayısına göre küçükten büyüğe sırala (En az botu olan en başa gelir)
        activeNodes.sort((a, b) => a.currentBots - b.currentBots);
        return activeNodes[0];
    }
    /**
     * Belirtilen Node'un bot sayısını artırır
     */
    incrementBotCount(nodeId) {
        const node = this.nodes.get(nodeId);
        if (node) {
            node.currentBots += 1;
            this.nodes.set(nodeId, node);
        }
    }
    /**
     * Belirtilen Node'un bot sayısını eksiltir
     */
    decrementBotCount(nodeId) {
        const node = this.nodes.get(nodeId);
        if (node && node.currentBots > 0) {
            node.currentBots -= 1;
            this.nodes.set(nodeId, node);
        }
    }
    /**
     * Tüm Node'ların listesini döner (Master Paneli için)
     */
    getAllNodes() {
        return Array.from(this.nodes.values());
    }
    /**
     * ID'ye göre Node getirir
     */
    getNode(id) {
        return this.nodes.get(id);
    }
    /**
     * Node'u sistemden siler
     */
    removeNode(id) {
        return this.nodes.delete(id);
    }
}
exports.NodeManager = NodeManager;
//# sourceMappingURL=NodeManager.js.map