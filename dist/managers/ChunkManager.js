"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChunkManager = void 0;
const Logger_1 = require("../utils/Logger");
/**
 * Chunk paketlerini parse edip World'e yazar.
 *
 * Düzeltilen hata: version "auto" geçildiğinde prismarine-chunk yükleme
 * constructor'da başarısız oluyordu. Artık ChunkColumn yükleme işlemi
 * ilk gerçek chunk paketi geldiğinde lazy yapılır; o noktada sürüm
 * zaten protocol tarafından müzakere edilmiş olur.
 */
class ChunkManager {
    bus;
    world;
    version;
    getProtocolVersion;
    ChunkColumn = null;
    loadedChunkCount = 0;
    resolvedVersion = null;
    constructor(bus, world, 
    /** Başlangıç sürümü; "auto" ise ilk chunk gelene kadar ertelenir. */
    version, 
    /** Protokolden gerçek sürümü okumak için callback. */
    getProtocolVersion) {
        this.bus = bus;
        this.world = world;
        this.version = version;
        this.getProtocolVersion = getProtocolVersion;
        // Sürüm "auto" değilse hemen yüklemeyi dene.
        if (version && version !== "auto") {
            this.tryLoadChunkClass(version);
        }
        this.bus.on("packet:map_chunk", (data) => this.handleChunkData(data));
        this.bus.on("packet:level_chunk_with_light", (data) => this.handleChunkData(data));
        this.bus.on("packet:unload_chunk", (data) => this.handleUnload(data));
    }
    tryLoadChunkClass(version) {
        if (version === "auto" || !version)
            return false;
        if (this.resolvedVersion === version && this.ChunkColumn)
            return true;
        try {
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            this.ChunkColumn = require("prismarine-chunk")(version);
            this.resolvedVersion = version;
            Logger_1.Logger.debug("ChunkManager", `prismarine-chunk ${version} için yüklendi.`);
            return true;
        }
        catch (err) {
            Logger_1.Logger.warn("ChunkManager", `prismarine-chunk '${version}' için yüklenemedi:`, err);
            return false;
        }
    }
    ensureChunkClass() {
        if (this.ChunkColumn)
            return true;
        // "auto" veya bilinmeyen → gerçek versiyonu protokolden oku.
        const protoVer = this.getProtocolVersion();
        if (protoVer && protoVer !== "auto") {
            return this.tryLoadChunkClass(protoVer);
        }
        return false;
    }
    handleChunkData(data) {
        if (!this.ensureChunkClass())
            return;
        const chunkX = data.x;
        const chunkZ = data.z;
        try {
            const column = new this.ChunkColumn({ minY: data.minY ?? -64, worldHeight: data.worldHeight ?? 384 });
            const buffer = data.chunkData ?? data.data;
            if (buffer) {
                column.load(buffer, data.bitMap ?? undefined, true);
            }
            this.world.setColumn(chunkX, chunkZ, column);
            this.loadedChunkCount++;
            this.bus.emit("chunkLoad", { x: chunkX, z: chunkZ, column });
        }
        catch (err) {
            Logger_1.Logger.debug("ChunkManager", `chunk (${chunkX},${chunkZ}) parse edilemedi (versiyon uyumsuzluğu olabilir):`, err);
        }
    }
    handleUnload(data) {
        const x = data.chunkX ?? data.x;
        const z = data.chunkZ ?? data.z;
        if (x === undefined || z === undefined)
            return;
        this.world.unloadColumn(x, z);
        this.loadedChunkCount = Math.max(0, this.loadedChunkCount - 1);
        this.bus.emit("chunkUnload", { x, z });
    }
    get loaded() {
        return this.loadedChunkCount;
    }
}
exports.ChunkManager = ChunkManager;
//# sourceMappingURL=ChunkManager.js.map