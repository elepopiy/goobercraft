"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerController = void 0;
class WorkerController {
    static getWorkers(req, res) {
        res.json({
            success: true,
            workers: []
        });
    }
    static registerWorker(req, res) {
        res.json({
            success: true,
            message: "Worker kayıt sistemi hazırlanıyor."
        });
    }
}
exports.WorkerController = WorkerController;
//# sourceMappingURL=WorkerController.js.map