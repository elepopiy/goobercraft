"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const managers_1 = require("../../managers"); // ✅ İki üst klasöre çıkıldığından emin olundu
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
        return res.json({
            success: true,
            nodes: managers_1.manager.nodes.getAllNodes()
        });
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=NodeController.js.map