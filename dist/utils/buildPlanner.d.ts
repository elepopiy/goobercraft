export type BuildPlanStepType = "chat" | "look" | "move" | "equip" | "place" | "wait";
export interface BuildPlanStep {
    type: BuildPlanStepType;
    message?: string;
    target?: string;
    direction?: "forward" | "back";
}
export declare function createBuildPlanSteps(request: string, aiPlan?: string): BuildPlanStep[];
//# sourceMappingURL=buildPlanner.d.ts.map