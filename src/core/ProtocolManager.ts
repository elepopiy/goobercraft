import { createClient, Client } from "minecraft-protocol";
import { ResolvedBotOptions } from "../utils/types";
import { EventBus } from "./EventBus";
import { Logger } from "../utils/Logger";
import { getMcData, buildGroundFields, MovementFlags } from "../utils/MovementPacketCompat";
import { manager } from "../managers"; // 👈 MANAGER IMPORT'U EKLENDİ

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
    // 🚀 CANLI KAYIT KANCASI (HOOK):
    // Bot ne zaman bağlanmaya çalışsa, Master Node yoksa anında oluşturulur ve aktif kılınır!
    if (manager && manager.nodes) {
      manager.nodes.registerNode({
        id: "master-node-1",
        name: "GooberCraft Master Node",
        url: "http://localhost:10000",
        maxBots: 10
      });
    }

    Logger.info("ProtocolManager", `${this.options.host}:${this.options.port} adresine bağlanılıyor...`);

    this.client = createClient({
      host: this.options.host,
      port: this.options.port,
      username: this.options.username,
      password: this.options.password,
      auth: this.options.auth,
      version: this.options.version === "auto" ? undefined : this.options.version,
      checkTimeoutInterval: this.options.checkTimeoutInterval,
      keepAlive: false, // KeepAliveManager kendi mantığını yürütecek
    } as any);

    const client: any = this.client;
    client.on("connect", () => this.bus.emit("_raw_connect"));
    client.on("disconnect", (data: any) => this.bus.emit("_raw_disconnect", data));
    client.on("end", (reason: string) => this.bus.emit("_raw_end", reason));
    client.on("error", (err: Error) => this.bus.emit("_raw_error", err));
    client.on("kick_disconnect", (data: any) => this.bus.emit("_raw_kick", data));
    client.on("state", (newState: string) => this.bus.emit("_raw_state", newState));

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