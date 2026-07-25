"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusController = void 0;
class StatusController {
    static getStatus(req, res) {
        res.json({
            success: true,
            data: {
                online: true,
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                cpu: process.cpuUsage(),
                node: process.version,
                platform: process.platform
            }
        });
    }
}
exports.StatusController = StatusController;
//# sourceMappingURL=StatusController.js.map