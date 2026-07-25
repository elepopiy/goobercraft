"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WeatherManager = void 0;
const GAME_EVENT_BEGIN_RAIN = 2;
const GAME_EVENT_END_RAIN = 1;
const GAME_EVENT_RAIN_LEVEL = 7;
const GAME_EVENT_THUNDER_LEVEL = 8;
class WeatherManager {
    bus;
    state = { raining: false, rainLevel: 0, thunderLevel: 0 };
    constructor(bus) {
        this.bus = bus;
        this.bus.on("packet:game_state_change", (data) => this.handleGameStateChange(data));
    }
    handleGameStateChange(data) {
        switch (data.reason) {
            case GAME_EVENT_BEGIN_RAIN:
                this.state.raining = true;
                this.bus.emit("rain", true);
                break;
            case GAME_EVENT_END_RAIN:
                this.state.raining = false;
                this.bus.emit("rain", false);
                break;
            case GAME_EVENT_RAIN_LEVEL:
                this.state.rainLevel = data.gameMode ?? data.value ?? 0;
                break;
            case GAME_EVENT_THUNDER_LEVEL:
                this.state.thunderLevel = data.gameMode ?? data.value ?? 0;
                break;
            default:
                break;
        }
    }
}
exports.WeatherManager = WeatherManager;
//# sourceMappingURL=WeatherManager.js.map