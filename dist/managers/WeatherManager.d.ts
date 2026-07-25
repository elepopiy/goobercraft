import { EventBus } from "../core/EventBus";
import { WeatherState } from "../utils/types";
export declare class WeatherManager {
    private readonly bus;
    state: WeatherState;
    constructor(bus: EventBus);
    private handleGameStateChange;
}
//# sourceMappingURL=WeatherManager.d.ts.map