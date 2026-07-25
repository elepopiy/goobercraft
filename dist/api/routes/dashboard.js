"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (_, res) => {
    res.json({
        success: true,
        dashboard: {
            bots: 0,
            workers: 0,
            nodes: 0,
            cpu: 0,
            ram: process.memoryUsage().rss
        }
    });
});
exports.default = router;
//# sourceMappingURL=dashboard.js.map