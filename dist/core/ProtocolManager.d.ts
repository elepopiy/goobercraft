import { Client } from "minecraft-protocol";
import { ResolvedBotOptions } from "../utils/types";
import { EventBus } from "./EventBus";
import { MovementFlags } from "../utils/MovementPacketCompat";
/**
 * ProtocolManager, minecraft-protocol'un düşük seviye Client'ını yönetir.
 * Handshake, login, configuration, compression ve encryption tamamen
 * minecraft-protocol tarafından otomatik yürütülür (bu kütüphanenin
 * sorumluluğu değildir) — GooberCraft'ın işi bu client'tan gelen
 * paketleri kendi EventBus'ına aktarmak ve giden paketleri tek bir
 * merkezi yerden yazmaktır.
 */
export declare class ProtocolManager {
    client: Client;
    private readonly options;
    private readonly bus;
    private closed;
    constructor(options: ResolvedBotOptions, bus: EventBus);
    connect(): void;
    write(name: string, params: Record<string, unknown>): void;
    /**
     * Bağlı olunan sunucunun (negotiated) protokol sürümünü döndürür.
     * Henüz bağlanılmadıysa veya sürüm bilinmiyorsa undefined döner.
     */
    getVersion(): string | undefined;
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
    writeMovement(name: string, protodefTypeName: string, base: Record<string, unknown>, flags: MovementFlags): void;
    end(reason?: string): void;
    isClosed(): boolean;
}
//# sourceMappingURL=ProtocolManager.d.ts.map