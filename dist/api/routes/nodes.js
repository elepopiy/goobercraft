"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNodesList = getNodesList;
const express_1 = require("express");
const os_1 = __importDefault(require("os"));
const router = (0, express_1.Router)();
// 10 Tane Hazır Rack (Node) Tanımlaması — statik iskelet, canlı metrikler her çağrıda hesaplanır
const baseNodes = Array.from({ length: 10 }, (_, index) => ({
    id: `master-node-${index + 1}`,
    name: `DataCenter Rack #${index + 1}`,
    maxBots: 10,
    online: true,
}));
/**
 * Anlık CPU/RAM metrikleriyle zenginleştirilmiş, GÜNCEL node listesini döner.
 * Hem GET /api/nodes hem de BotController'ın node seçim mantığı bu fonksiyonu kullanır,
 * böylece iki taraf da AYNI veriyi görür.
 */
function getNodesList() {
    const totalMem = os_1.default.totalmem();
    const freeMem = os_1.default.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
    const cpus = os_1.default.cpus().length || 1;
    const load = os_1.default.loadavg()[0] || 0;
    const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 8, 100);
    return baseNodes.map((node) => ({
        ...node,
        cpuUsage: cpuPercent,
        ramUsage: `${Math.round(usedMemMB / baseNodes.length)} MB`, // Rack başına ortalama yük dağılımı
    }));
}
router.get("/", (req, res) => {
    const updatedNodes = getNodesList();
    return res.json({
        success: true,
        count: updatedNodes.length,
        nodes: updatedNodes,
    });
});
exports.default = router;
//# sourceMappingURL=nodes.js.map