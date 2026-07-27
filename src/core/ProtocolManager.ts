import { createClient, Client } from "minecraft-protocol";
import { ResolvedBotOptions } from "../utils/types";
import { EventBus } from "./EventBus";
import { Logger } from "../utils/Logger";
import { getMcData, buildGroundFields, MovementFlags } from "../utils/MovementPacketCompat";

/**
 * ProtocolManager, minecraft-protocol'un düşük seviye Client'ını yönetir.
 */
export class ProtocolManager {
  public client!: Client;
  private readonly options: ResolvedBotOptions;
  private readonly bus: EventBus;
  private closed = false;

  constructor(options: ResolvedBotOptions, bus: EventBus) {
    this.options = options;
    this.bus = bus;
  }

  connect(): void {
    const targetPort = Number(this.options.port) || 25565;
    Logger.info("ProtocolManager", `${this.options.host}:${targetPort} adresine bağlanılıyor...`);

    this.client = createClient({
      host: this.options.host,
      port: targetPort,
      username: this.options.username,
      password: this.options.password,
      // Eğer auth belirtilmediyse varsayılan olarak 'offline' (crackli) giriş yapmayı dener
      auth: this.options.auth || "offline",
      // 'auto' yerine false vermek minecraft-protocol'da versiyon algılamayı daha iyi tetikler
      version: this.options.version === "auto" ? false : this.options.version,
      checkTimeoutInterval: this.options.checkTimeoutInterval,
      keepAlive: false, // KeepAliveManager kendi mantığını yürütecek
    } as any);

    const client: any = this.client;
    client.on("connect", () => this.bus.emit("_raw_connect"));
    client.on("disconnect", (data: any) => this.bus.emit("_raw_disconnect", data));
    client.on("end", (reason: string) => this.bus.emit("_raw_end", reason));
    client.on("error", (err: Error) => {
      this.bus.emit("_raw_error", err);
      this.bus.emit("_raw_disconnect", err);
    });
    client.on("kick_disconnect", (data: any) => this.bus.emit("_raw_kick", data));
    client.on("state", (newState: string) => this.bus.emit("_raw_state", newState));
    client.on("playerJoin", () => this.bus.emit("_raw_playerJoin"));

    client.on("packet", (data: any, meta: { name: string; state: string }) => {
      this.bus.emit(`packet:${meta.name}`, data, meta);
      this.bus.emit("packet", data, meta);
    });
  }

  write(name: string, params: Record<string, unknown>): void {
    if (this.closed || !this.client) return;
    try {
      this.client.write(name as any, params as any);
    } catch (err) {
      Logger.error("ProtocolManager", `'${name}' paketi yazılamadı:`, err);
    }
  }

  getVersion(): string | undefined {
    return (this.client as any)?.version;
  }

  writeMovement(
    name: string,
    protodefTypeName: string,
    base: Record<string, unknown>,
    flags: MovementFlags
  ): void {
    if (this.closed || !this.client) return;
    try {
      const mcData = getMcData(this.getVersion());
      const groundFields = buildGroundFields(mcData, protodefTypeName, flags);
      this.write(name, { ...base, ...groundFields });
    } catch (err) {
      Logger.error("ProtocolManager", `'${name}' hareket paketi oluşturulamadı, bu tick atlanıyor:`, err);
    }
  }

  end(reason?: string): void {
    if (this.closed) return;
    this.closed = true;
    try {
      this.client?.end(reason ?? "disconnect.quitting");
    } catch {
      // client zaten kapanmış olabilir
    }
  }

  isClosed(): boolean {
    return this.closed;
  }
}