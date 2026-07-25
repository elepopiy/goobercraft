import { EventBus } from "../core/EventBus";
import { WeatherState } from "../utils/types";

const GAME_EVENT_BEGIN_RAIN = 2;
const GAME_EVENT_END_RAIN = 1;
const GAME_EVENT_RAIN_LEVEL = 7;
const GAME_EVENT_THUNDER_LEVEL = 8;

export class WeatherManager {
  public state: WeatherState = { raining: false, rainLevel: 0, thunderLevel: 0 };

  constructor(private readonly bus: EventBus) {
    this.bus.on("packet:game_state_change", (data: any) => this.handleGameStateChange(data));
  }

  private handleGameStateChange(data: any): void {
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
