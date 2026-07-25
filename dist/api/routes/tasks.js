"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get("/", (_, res) => {
    res.json({
        success: true,
        tasks: []
    });
});
exports.default = router;
//# sourceMappingURL=tasks.js.map