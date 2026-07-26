"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeBotProfile = normalizeBotProfile;
exports.parseBotProfileAction = parseBotProfileAction;
function normalizeBotProfile(profile) {
    switch ((profile ?? "stable").toLowerCase()) {
        case "combat":
            return "combat";
        case "builder":
            return "builder";
        case "chatter":
            return "chatter";
        case "stable":
            return "stable";
        default:
            return "stable";
    }
}
function parseBotProfileAction(profile, message) {
    const normalized = normalizeBotProfile(profile);
    const trimmed = message.trim();
    if (normalized === "combat") {
        return { type: "combat" };
    }
    if (normalized === "builder") {
        if (trimmed.startsWith("!yap") || trimmed.startsWith("!build") || trimmed.includes("yap")) {
            const detail = trimmed.replace(/^!yap|^!build/i, "").trim() || "taş ev";
            return { type: "build", detail };
        }
        return { type: "stable" };
    }
    if (normalized === "chatter") {
        const trimmed = message.trim();
        if (trimmed.startsWith("!sor")) {
            const detail = trimmed.slice(4).trim() || "merhaba";
            return { type: "chat", detail };
        }
        return { type: "stable" };
    }
    return { type: "stable" };
}
//# sourceMappingURL=botProfiles.js.map