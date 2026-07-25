"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GooberManager = void 0;
const BotManager_1 = require("./BotManager");
const NodeManager_1 = require("./NodeManager");
const TaskManager_1 = require("./TaskManager");
const UserManager_1 = require("./UserManager");
class GooberManager {
    static instance;
    bots;
    nodes;
    tasks;
    users;
    constructor() {
        this.bots = new BotManager_1.BotManager();
        this.nodes = new NodeManager_1.NodeManager();
        this.tasks = new TaskManager_1.TaskManager();
        this.users = new UserManager_1.UserManager();
    }
    static getInstance() {
        if (!GooberManager.instance) {
            GooberManager.instance = new GooberManager();
        }
        return GooberManager.instance;
    }
}
exports.GooberManager = GooberManager;
//# sourceMappingURL=GooberManager.js.map