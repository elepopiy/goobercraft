"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const NodeManager_1 = require("../../managers/NodeManager");
// Projendeki NodeManager örneğini buraya aktarabilirsin
class NodeController {
    static nodeManager = new NodeManager_1.NodeManager();
    static getNodes(req, res) {
        res.json({
            success: true,
            nodes: NodeController.nodeManager.getAll()
        });
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=NodeController.js.map