import { Vec3 } from "vec3";
export type BuildPlanStepType = "chat" | "look" | "move" | "equip" | "place" | "wait";
export interface BuildPlanStep {
    type: BuildPlanStepType;
    message?: string;
    target?: string;
    direction?: "forward" | "back";
    position?: Vec3;
    blockType?: string;
}
export interface BlockTarget {
    x: number;
    y: number;
    z: number;
    block: string;
}
export declare const MAX_BUILD_BLOCKS = 228;
export declare function inferBuildItem(detail: string): string;
/**
  AI veya Istek Tarafından Üretilen Yapı Matrisini 228 Blok ile Sınırlar
 */
export declare function sanitizeBlockList(blocks: BlockTarget[]): BlockTarget[];
export declare function createBuildPlanSteps(request: string, aiPlan?: string): BuildPlanStep[];
//# sourceMappingURL=buildPlanner.d.ts.map