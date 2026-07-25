"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.nodesList = void 0;
const express_1 = require("express");
const os_1 = __importDefault(require("os"));
const router = (0, express_1.Router)();
// Bellekte en azından master-node-1 bulunsun
exports.nodesList = [
    {
        id: "master-node-1",
        name: "Master DataCenter Node",
        maxBots: 10,
        online: true,
        cpuUsage: 0,
        ramUsage: "0 MB"
    }
];
router.get("/", (req, res) => {
    // Gerçek Sistem RAM & CPU Metriklerini Hesapla
    const totalMem = os_1.default.totalmem();
    const freeMem = os_1.default.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
    const cpuLoad = Math.round(os_1.default.loadavg()[0] * 10) || 12; // Sistem yükü %
    // Master node'u canlı metriklerle güncelle
    if (exports.nodesList.length === 0) {
        exports.nodesList.push({ id: "master-node-1", name: "Master DataCenter Node", maxBots: 10, online: true });
    }
    exports.nodesList[0].cpuUsage = cpuLoad;
    exports.nodesList[0].ramUsage = `${usedMemMB} MB`;
    // Frontend hem { success, nodes } hem de düz [] beklerse çakışmasın diye
    res.json({
        success: true,
        nodes: exports.nodesList
    });
});
exports.default = router;
//# sourceMappingURL=nodes.js.map