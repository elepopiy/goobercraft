"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const managers_1 = require("../../managers");
class NodeController {
    static getNodes(req, res) {
        let nodesList = managers_1.manager.nodes.getAllNodes();
        // GARANTİ KONTROLÜ: Eğer liste boşsa Master Node'u anında hafızaya yeniden kaydet
        if (!nodesList || nodesList.length === 0) {
            managers_1.manager.nodes.registerNode({
                id: "master-node-1",
                name: "GooberCraft Master Node",
                url: "http://localhost:10000",
                maxBots: 10
            });
            nodesList = managers_1.manager.nodes.getAllNodes();
        }
        return res.json({
            success: true,
            count: nodesList.length,
            nodes: nodesList
        });
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=NodeController.js.map