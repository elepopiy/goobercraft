import { EventBus } from "../core/EventBus";
import { ExperienceState } from "../utils/types";
export declare class ExperienceManager {
    private readonly bus;
    state: ExperienceState;
    constructor(bus: EventBus);
    private handleExperience;
}
//# sourceMappingURL=ExperienceManager.d.ts.map