"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createBuildPlanSteps = createBuildPlanSteps;
function normalizeStepText(value) {
    return value.replace(/^[-*0-9.]+\s*/, "").trim();
}
function inferBuildItem(detail) {
    const lower = detail.toLowerCase();
    if (lower.includes("cam") || lower.includes("pencere") || lower.includes("glass")) {
        return "minecraft:glass";
    }
    if (lower.includes("ışık") || lower.includes("torch")) {
        return "minecraft:torch";
    }
    if (lower.includes("masa") || lower.includes("craft")) {
        return "minecraft:crafting_table";
    }
    if (lower.includes("duvar") || lower.includes("blok") || lower.includes("kule")) {
        return "minecraft:stone";
    }
    return "minecraft:oak_planks";
}
function createBuildPlanSteps(request, aiPlan) {
    const fallbackSteps = [
        { type: "chat", message: `Plan başlıyor: ${request || "yapı"}` },
        { type: "look", target: "front" },
        { type: "move", direction: "forward" },
        { type: "equip", target: inferBuildItem(request) },
        { type: "wait" },
        { type: "look", target: "front" },
        { type: "place", target: "base" },
        { type: "look", target: "up" },
        { type: "place", target: "wall" },
        { type: "chat", message: `İnşaat tamamlandı: ${request || "yapı"}` },
    ];
    if (!aiPlan || !aiPlan.trim()) {
        return fallbackSteps;
    }
    const lines = aiPlan
        .split(/\n+/)
        .map(normalizeStepText)
        .filter(Boolean)
        .slice(0, 10);
    if (lines.length === 0) {
        return fallbackSteps;
    }
    const steps = lines.map((line) => {
        const lower = line.toLowerCase();
        if (lower.includes("malzeme") || lower.includes("topla") || lower.includes("equip")) {
            return { type: "equip", target: inferBuildItem(request) };
        }
        if (lower.includes("temel") || lower.includes("kur") || lower.includes("başla")) {
            return { type: "place", target: "base" };
        }
        if (lower.includes("duvar") || lower.includes("yükse") || lower.includes("blok")) {
            return { type: "place", target: "wall" };
        }
        if (lower.includes("bak") || lower.includes("yön")) {
            return { type: "look", target: "front" };
        }
        if (lower.includes("yürü") || lower.includes("hareket")) {
            return { type: "move", direction: "forward" };
        }
        if (lower.includes("bekle") || lower.includes("dur")) {
            return { type: "wait" };
        }
        return { type: "chat", message: line };
    });
    while (steps.length < 10) {
        steps.push(fallbackSteps[steps.length] ?? fallbackSteps[fallbackSteps.length - 1]);
    }
    return steps.slice(0, 10);
}
//# sourceMappingURL=buildPlanner.js.map