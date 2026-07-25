"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeManager = void 0;
class NodeManager {
    nodes = new Map();
    add(node) {
        this.nodes.set(node.id, node);
    }
    // DÜZELTİLDİ: 'return' eklendi
    remove(id) {
        return this.nodes.delete(id);
    }
    get(id) {
        return this.nodes.get(id);
    }
    getAll() {
        return [...this.nodes.values()];
    }
    count() {
        return this.nodes.size;
    }
    exists(id) {
        return this.nodes.has(id);
    }
    clear() {
        this.nodes.clear();
    }
    getAvailableNode() {
        return [...this.nodes.values()].find((n) => n.online && n.currentBots < n.maxBots);
    }
}
exports.NodeManager = NodeManager;
//# sourceMappingURL=NodeManager.js.map