"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkerManager = void 0;
class WorkerManager {
    workers = new Map();
    add(worker) {
        this.workers.set(worker.id, worker);
    }
    remove(id) {
        return this.workers.delete(id);
    }
    get(id) {
        return this.workers.get(id);
    }
    getAll() {
        return [...this.workers.values()];
    }
    count() {
        return this.workers.size;
    }
}
exports.WorkerManager = WorkerManager;
//# sourceMappingURL=WorkerManager.js.map