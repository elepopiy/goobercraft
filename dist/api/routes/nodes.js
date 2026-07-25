"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodesList = void 0;
const express_1 = require("express");
const os_1 = __importDefault(require("os"));
const router = (0, express_1.Router)();
// 10 Tane Hazır Rack (Node) Tanımlaması
exports.nodesList = Array.from({ length: 10 }, (_, index) => ({
    id: `master-node-${index + 1}`,
    name: `DataCenter Rack #${index + 1}`,
    maxBots: 10,
    online: true,
    cpuUsage: 0,
    ramUsage: "0 MB"
}));
router.get("/", (req, res) => {
    // Gerçek Sistem RAM & CPU Metriklerini Hesapla
    const totalMem = os_1.default.totalmem();
    const freeMem = os_1.default.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
    const cpus = os_1.default.cpus().length;
    const load = os_1.default.loadavg()[0];
    const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 8, 100);
    // Bütün Rack'lerin canlı metriklerini güncelle
    const updatedNodes = exports.nodesList.map(node => ({
        ...node,
        cpuUsage: cpuPercent,
        ramUsage: `${Math.round(usedMemMB / 10)} MB` // Rack başına ortalama yük dağılımı
    }));
    return res.json({
        success: true,
        count: updatedNodes.length,
        nodes: updatedNodes
    });
});
exports.default = router;
//# sourceMappingURL=nodes.js.map