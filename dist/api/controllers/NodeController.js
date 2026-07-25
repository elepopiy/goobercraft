"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NodeController = void 0;
const managers_1 = require("../../managers");
const os_1 = __importDefault(require("os"));
class NodeController {
    static getNodes(req, res) {
        let nodesList = managers_1.manager.nodes.getAllNodes();
        // 1. Master Node yoksa kaydet
        if (!nodesList || nodesList.length === 0) {
            managers_1.manager.nodes.registerNode({
                id: "master-node-1",
                name: "GooberCraft Master Node",
                url: "http://localhost:10000",
                maxBots: 10
            });
            nodesList = managers_1.manager.nodes.getAllNodes();
        }
        // 2. Sistem Yükünü ve CPU/RAM Kullanımını Hesapla
        const totalMem = os_1.default.totalmem();
        const freeMem = os_1.default.freemem();
        const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
        const cpus = os_1.default.cpus().length || 1;
        const load = os_1.default.loadavg()[0] || 0;
        const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 12, 100);
        // Her bir Node kasasına canlı metrik verilerini entegre et
        const enrichedNodes = nodesList.map(node => ({
            ...node,
            online: true,
            cpuUsage: cpuPercent,
            ramUsage: `${usedMemMB} MB`,
            maxBots: node.maxBots || 10
        }));
        return res.json({
            success: true,
            count: enrichedNodes.length,
            nodes: enrichedNodes
        });
    }
}
exports.NodeController = NodeController;
//# sourceMappingURL=NodeController.js.map