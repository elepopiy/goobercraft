"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
class TaskController {
    static getTasks(req, res) {
        res.json({
            success: true,
            tasks: []
        });
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=TaskController.js.map