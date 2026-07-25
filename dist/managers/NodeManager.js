"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeManager = void 0;
class NodeManager {
    nodes = new Map();
    register(node) {
        this.nodes.set(node.id, node);
    }
    get(id) {
        return this.nodes.get(id);
    }
    getAll() {
        return [...this.nodes.values()];
    }
    getAvailableNode() {
        return this.getAll()
            .filter(n => n.online)
            .sort((a, b) => {
            const aLoad = a.currentBots / a.maxBots;
            const bLoad = b.currentBots / b.maxBots;
            return aLoad - bLoad;
        })[0];
    }
}
exports.NodeManager = NodeManager;
//# sourceMappingURL=NodeManager.js.map