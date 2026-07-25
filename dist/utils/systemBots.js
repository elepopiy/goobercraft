"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSystemBotCount = getSystemBotCount;
exports.isSystemBotId = isSystemBotId;
exports.getSystemBotsForNode = getSystemBotsForNode;
const SYSTEM_BOT_RATIO = 0.1;
function getSystemBotCount(maxBots) {
    return Math.floor((maxBots || 0) * SYSTEM_BOT_RATIO);
}
function isSystemBotId(id) {
    return typeof id === "string" && id.startsWith("sys_");
}
// Deterministic - aynı node her zaman aynı sistem botlarını üretir, rastgelelik yok
function getSystemBotsForNode(node) {
    const count = getSystemBotCount(node.maxBots);
    const bots = [];
    for (let i = 0; i < count; i++) {
        bots.push({
            id: `sys_${node.id}_${i}`,
            nodeId: node.id,
            username: `SYS-Guardian-${String(i + 1).padStart(2, "0")}`,
            host: "internal.system",
            ownerToken: "SYSTEM",
            isSystem: true
        });
    }
    return bots;
}
//# sourceMappingURL=systemBots.js.map