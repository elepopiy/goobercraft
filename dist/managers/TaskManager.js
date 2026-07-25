"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
class TaskManager {
    queue = [];
    push(task) {
        this.queue.push(task);
    }
    pop() {
        return this.queue.shift();
    }
    size() {
        return this.queue.length;
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=TaskManager.js.map