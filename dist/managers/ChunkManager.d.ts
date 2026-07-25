import { EventBus } from "../core/EventBus";
import { World } from "../world/World";
/**
 * Chunk paketlerini parse edip World'e yazar.
 *
 * Düzeltilen hata: version "auto" geçildiğinde prismarine-chunk yükleme
 * constructor'da başarısız oluyordu. Artık ChunkColumn yükleme işlemi
 * ilk gerçek chunk paketi geldiğinde lazy yapılır; o noktada sürüm
 * zaten protocol tarafından müzakere edilmiş olur.
 */
export declare class ChunkManager {
    private readonly bus;
    private readonly world;
    /** Başlangıç sürümü; "auto" ise ilk chunk gelene kadar ertelenir. */
    private readonly version;
    /** Protokolden gerçek sürümü okumak için callback. */
    private readonly getProtocolVersion;
    private ChunkColumn;
    private loadedChunkCount;
    private resolvedVersion;
    constructor(bus: EventBus, world: World, 
    /** Başlangıç sürümü; "auto" ise ilk chunk gelene kadar ertelenir. */
    version: string, 
    /** Protokolden gerçek sürümü okumak için callback. */
    getProtocolVersion: () => string | undefined);
    private tryLoadChunkClass;
    private ensureChunkClass;
    private handleChunkData;
    private handleUnload;
    get loaded(): number;
}
//# sourceMappingURL=ChunkManager.d.ts.map