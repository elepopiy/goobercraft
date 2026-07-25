import { Vec3 } from "vec3";

export type AuthMode = "offline" | "microsoft" | "mojang";

export interface BotOptions {
  host: string;
  port?: number;
  username: string;
  password?: string;
  auth?: AuthMode;
  version?: string;
  viewDistance?: number;
  checkTimeoutInterval?: number;
  respawnOnDeath?: boolean;
}

export interface ResolvedBotOptions extends Required<Omit<BotOptions, "password">> {
  password?: string;
}

export interface ChatMessage {
  text: string;
  json: any;
  sender?: string;
  translate?: string;
}

export interface EntityData {
  id: number;
  uuid?: string;
  type: number;
  kind?: string;
  name?: string;
  position: Vec3;
  velocity: Vec3;
  yaw: number;
  pitch: number;
  headYaw: number;
  onGround: boolean;
  metadata: Record<number, any>;
  isPlayer: boolean;
  health?: number;
  username?: string;
}

export interface PlayerData {
  uuid: string;
  username: string;
  displayName?: string;
  ping: number;
  gamemode: number;
  entity?: EntityData;
}

export interface ItemStack {
  slot: number;
  present: boolean;
  itemId?: number;
  itemCount?: number;
  nbt?: any;
  name?: string;
}

export interface ControlStates {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  jump: boolean;
  sneak: boolean;
  sprint: boolean;
}

export type ControlName = keyof ControlStates;

export interface RaycastResult {
  position: Vec3;
  blockPosition: Vec3;
  face: Vec3;
  distance: number;
}

export interface WeatherState {
  raining: boolean;
  rainLevel: number;
  thunderLevel: number;
}

export interface ExperienceState {
  level: number;
  progress: number;
  total: number;
}
