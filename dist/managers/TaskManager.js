"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskManager = void 0;
class TaskManager {
    tasks = new Map();
    add(task) {
        this.tasks.set(task.id, task);
    }
    remove(id) {
        return this.tasks.delete(id);
    }
    get(id) {
        return this.tasks.get(id);
    }
    getAll() {
        return [...this.tasks.values()];
    }
    count() {
        return this.tasks.size;
    }
}
exports.TaskManager = TaskManager;
//# sourceMappingURL=TaskManager.js.map