import { EventBus } from "../core/EventBus";
import { World } from "../world/World";
import { Logger } from "../utils/Logger";

/**
 * Chunk paketlerini parse edip World'e yazar.
 *
 * Düzeltilen hata: version "auto" geçildiğinde prismarine-chunk yükleme
 * constructor'da başarısız oluyordu. Artık ChunkColumn yükleme işlemi
 * ilk gerçek chunk paketi geldiğinde lazy yapılır; o noktada sürüm
 * zaten protocol tarafından müzakere edilmiş olur.
 */
export class ChunkManager {
  private ChunkColumn: any = null;
  private loadedChunkCount = 0;
  private resolvedVersion: string | null = null;

  constructor(
    private readonly bus: EventBus,
    private readonly world: World,
    /** Başlangıç sürümü; "auto" ise ilk chunk gelene kadar ertelenir. */
    private readonly version: string,
    /** Protokolden gerçek sürümü okumak için callback. */
    private readonly getProtocolVersion: () => string | undefined
  ) {
    // Sürüm "auto" değilse hemen yüklemeyi dene.
    if (version && version !== "auto") {
      this.tryLoadChunkClass(version);
    }

    this.bus.on("packet:map_chunk", (data: any) => this.handleChunkData(data));
    this.bus.on("packet:level_chunk_with_light", (data: any) => this.handleChunkData(data));
    this.bus.on("packet:unload_chunk", (data: any) => this.handleUnload(data));
  }

  private tryLoadChunkClass(version: string): boolean {
    if (version === "auto" || !version) return false;
    if (this.resolvedVersion === version && this.ChunkColumn) return true;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.ChunkColumn = require("prismarine-chunk")(version);
      this.resolvedVersion = version;
      Logger.debug("ChunkManager", `prismarine-chunk ${version} için yüklendi.`);
      return true;
    } catch (err) {
      Logger.warn("ChunkManager", `prismarine-chunk '${version}' için yüklenemedi:`, err);
      return false;
    }
  }

  private ensureChunkClass(): boolean {
    if (this.ChunkColumn) return true;

    // "auto" veya bilinmeyen → gerçek versiyonu protokolden oku.
    const protoVer = this.getProtocolVersion();
    if (protoVer && protoVer !== "auto") {
      return this.tryLoadChunkClass(protoVer);
    }
    return false;
  }

  private handleChunkData(data: any): void {
    if (!this.ensureChunkClass()) return;

    const chunkX: number = data.x;
    const chunkZ: number = data.z;

    try {
      const column = new this.ChunkColumn({ minY: data.minY ?? -64, worldHeight: data.worldHeight ?? 384 });
      const buffer: Buffer | undefined = data.chunkData ?? data.data;
      if (buffer) {
        column.load(buffer, data.bitMap ?? undefined, true);
      }
      this.world.setColumn(chunkX, chunkZ, column);
      this.loadedChunkCount++;
      this.bus.emit("chunkLoad", { x: chunkX, z: chunkZ, column });
    } catch (err) {
      Logger.debug(
        "ChunkManager",
        `chunk (${chunkX},${chunkZ}) parse edilemedi (versiyon uyumsuzluğu olabilir):`,
        err
      );
    }
  }

  private handleUnload(data: any): void {
    const x = data.chunkX ?? data.x;
    const z = data.chunkZ ?? data.z;
    if (x === undefined || z === undefined) return;
    this.world.unloadColumn(x, z);
    this.loadedChunkCount = Math.max(0, this.loadedChunkCount - 1);
    this.bus.emit("chunkUnload", { x, z });
  }

  get loaded(): number {
    return this.loadedChunkCount;
  }
}
