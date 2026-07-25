"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const managers_1 = require("../../managers");
class NodeController {
    static register(req, res) {
        const { id, name, url, maxBots } = req.body;
        if (!id || !url) {
            return res.status(400).json({
                success: false,
                message: "Node 'id' ve 'url' bilgisi zorunludur!"
            });
        }
        const node = managers_1.manager.nodes.registerNode({
            id,
            name,
            url,
            maxBots: maxBots ? Number(maxBots) : 10
        });
        return res.json({
            success: true,
            message: `Node '${node.id}' başarıyla kaydedildi.`,
            node
        });
    }
    static getNodes(req, res) {
        const nodesList = managers_1.manager.nodes.getAllNodes();
        // Hem { success: true, nodes: [...] } hem de esneklik için
        return res.json({
            success: true,
            count: nodesList.length,
            nodes: nodesList,
            data: nodesList // Frontend 'data' parametresi bekliyorsa çökmemesi için
        });
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=NodeController.js.map