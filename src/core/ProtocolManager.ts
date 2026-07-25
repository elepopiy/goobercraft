import { createClient, Client } from "minecraft-protocol";
import { ResolvedBotOptions } from "../utils/types";
import { EventBus } from "./EventBus";
import { Logger } from "../utils/Logger";
import { getMcData, buildGroundFields, MovementFlags } from "../utils/MovementPacketCompat";

/**
 * ProtocolManager, minecraft-protocol'un düşük seviye Client'ını yönetir.
 * Handshake, login, configuration, compression ve encryption tamamen
 * minecraft-protocol tarafından otomatik yürütülür (bu kütüphanenin
 * sorumluluğu değildir) — GooberCraft'ın işi bu client'tan gelen
 * paketleri kendi EventBus'ına aktarmak ve giden paketleri tek bir
 * merkezi yerden yazmaktır.
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

    // Her paket, ham haliyle EventBus üzerinden yayınlanır. Manager'lar
    // ilgilendikleri paket adına abone olur (packet:<name>).
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

  /**
   * Bağlı olunan sunucunun (negotiated) protokol sürümünü döndürür.
   * Henüz bağlanılmadıysa veya sürüm bilinmiyorsa undefined döner.
   */
  getVersion(): string | undefined {
    return (this.client as any)?.version;
  }

  /**
   * Serverbound "Move Player" ailesi paketleri (position, look,
   * position_look, vehicle_move vb.) için onGround/horizontalCollision
   * alanlarını sürüme uygun şekilde oluşturup gönderir.
   *
   * Minecraft 1.21.2 ile bu paketlerdeki "on ground" alanı düz bir
   * boolean olmaktan çıkıp bir bitfield'a ("flags") taşındı. Alan adını
   * sabit kodlamak yerine gerçek protodef şeması çalışma zamanında
   * incelenir (bkz. MovementPacketCompat) — böylece hem eski hem yeni
   * sürümlerde doğru paket üretilir. Şema çözülemezse veya yazma
   * başarısız olursa istisna burada yutulur: hareket paketi o an
   * gönderilemeyebilir, ama bağlantı asla bu yüzden kopmaz.
   */
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
