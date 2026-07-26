import { BotProfile } from "./types";
export type BotProfileAction = {
    type: "combat";
} | {
    type: "build";
    detail: string;
} | {
    type: "chat";
    detail: string;
} | {
    type: "stable";
};
export declare function normalizeBotProfile(profile?: string | BotProfile): BotProfile;
export declare function parseBotProfileAction(profile: string | BotProfile | undefined, message: string): BotProfileAction;
//# sourceMappingURL=botProfiles.d.ts.map