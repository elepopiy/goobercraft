"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const status_1 = __importDefault(require("./status"));
const bots_1 = __importDefault(require("./bots"));
const nodes_1 = __importDefault(require("./nodes"));
const workers_1 = __importDefault(require("./workers"));
const tasks_1 = __importDefault(require("./tasks"));
const dashboard_1 = __importDefault(require("./dashboard"));
const auth_1 = __importDefault(require("./auth"));
const router = (0, express_1.Router)();
router.use("/status", status_1.default);
router.use("/bots", bots_1.default);
router.use("/nodes", nodes_1.default);
router.use("/workers", workers_1.default);
router.use("/tasks", tasks_1.default);
router.use("/dashboard", dashboard_1.default);
router.use("/auth", auth_1.default);
exports.default = router;
//# sourceMappingURL=index.js.map