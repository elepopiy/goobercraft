import { Vec3 } from "vec3";

const { OctahedronIterator } = require("prismarine-world").iterators;

/**
 * A* Yol bulma ve arama için arayüzler
 */
export interface FindBlockOptions {
  matching: number | number[] | ((block: any) => boolean);
  point?: Vec3;
  maxDistance?: number;
  count?: number;
  useExtraInfo?: ((block: any) => boolean) | boolean;
}

export interface RaycastHit {
  position: Vec3;
  face?: number;
  block: any;
}

/**
 * Hafıza içi dünya durumunu tutar: chunk column'ları, blok erişimi,
 * Raycast, Blok arama, Görüş hattı ve Pathfinding desteği.
 */
export class World {
  /** Anahtar: "chunkX,chunkZ" */
  private columns = new Map<string, any>();

  private static columnKey(chunkX: number, chunkZ: number): string {
    return `${chunkX},${chunkZ}`;
  }

  // ── Chunk Yönetimi ────────────────────────────────────────────────────

  setColumn(chunkX: number, chunkZ: number, column: any): void {
    this.columns.set(World.columnKey(chunkX, chunkZ), column);
  }

  getColumn(chunkX: number, chunkZ: number): any | undefined {
    return this.columns.get(World.columnKey(chunkX, chunkZ));
  }

  unloadColumn(chunkX: number, chunkZ: number): void {
    this.columns.delete(World.columnKey(chunkX, chunkZ));
  }

  // ── Blok Erişim ve Güncelleme ─────────────────────────────────────────

  /**
   * Dünya koordinatlarındaki bloğu döner. Chunk yüklü değilse null döner.
   */
  getBlock(position: Vec3): any | null {
    const chunkX = Math.floor(position.x) >> 4;
    const chunkZ = Math.floor(position.z) >> 4;
    const column = this.getColumn(chunkX, chunkZ);
    if (!column) return null;

    try {
      const localX = ((Math.floor(position.x) % 16) + 16) % 16;
      const localZ = ((Math.floor(position.z) % 16) + 16) % 16;
      const y = Math.floor(position.y);
      return column.getBlock(new Vec3(localX, y, localZ)) ?? null;
    } catch {
      return null;
    }
  }

  /**
   * Belirli bir dünya koordinatındaki bloğun state ID'sini günceller.
   */
  setBlockStateId(position: Vec3, stateId: number): void {
    const chunkX = Math.floor(position.x) >> 4;
    const chunkZ = Math.floor(position.z) >> 4;
    const column = this.getColumn(chunkX, chunkZ);
    if (!column) return;

    try {
      const localX = ((Math.floor(position.x) % 16) + 16) % 16;
      const localZ = ((Math.floor(position.z) % 16) + 16) % 16;
      const y = Math.floor(position.y);

      if (typeof column.setBlockStateId === "function") {
        column.setBlockStateId(new Vec3(localX, y, localZ), stateId);
      } else if (typeof column.setBlock === "function") {
        column.setBlock(new Vec3(localX, y, localZ), { stateId });
      }
    } catch {
      // Chunk sınırı dışı veya yüklenmemiş section — sessizce atla
    }
  }

  // ── Biome İşlemleri ───────────────────────────────────────────────────

  getBiome(position: Vec3): number | null {
    const chunkX = Math.floor(position.x) >> 4;
    const chunkZ = Math.floor(position.z) >> 4;
    const column = this.getColumn(chunkX, chunkZ);
    if (!column) return null;

    try {
      const localX = ((Math.floor(position.x) % 16) + 16) % 16;
      const localZ = ((Math.floor(position.z) % 16) + 16) % 16;
      const y = Math.floor(position.y);

      if (typeof column.getBiome === "function") {
        return column.getBiome(new Vec3(localX, y, localZ)) ?? null;
      }
    } catch {
      // Yoksay
    }
    return null;
  }

  // ── Raycast ve Görüş Kontrolü (GoalLookAtBlock & GoalPlaceBlock Uyumlu) 

  /**
   * Belirtilen doğrultuda raycast atarak temas edilen ilk katı bloğu ve yüzeyi tespit eder.
   */
  raycast(from: Vec3, direction: Vec3, maxDistance: number): RaycastHit | null {
    const normDir = direction.clone().normalize();
    const step = 0.05;
    let traveled = 0;
    let prevPos = from.clone().floored();

    while (traveled <= maxDistance) {
      const currentPos = from.plus(normDir.scaled(traveled));
      const checkPos = currentPos.floored();
      const block = this.getBlock(checkPos);

      if (block && block.type !== 0 && block.boundingBox === "block") {
        // Çarpan yüzeyi (Face) hesapla
        let face = 1; // Varsayılan: üst yüzey
        const diff = checkPos.minus(prevPos);
        if (diff.y < 0) face = 1;      // Üst
        else if (diff.y > 0) face = 0; // Alt
        else if (diff.z < 0) face = 3; // Güney
        else if (diff.z > 0) face = 2; // Kuzey
        else if (diff.x < 0) face = 5; // Doğu
        else if (diff.x > 0) face = 4; // Batı

        return { position: checkPos, face, block };
      }

      prevPos = checkPos;
      traveled += step;
    }

    return null;
  }

  /**
   * İki nokta arasında engelleyici blok olup olmadığını test eder.
   */
  canSeeBlock(eyePos: Vec3, blockPos: Vec3, maxDistance = 4.5): boolean {
    const targetCenter = blockPos.offset(0.5, 0.5, 0.5);
    const dir = targetCenter.minus(eyePos);
    const hit = this.raycast(eyePos, dir, maxDistance);

    if (!hit) return false;
    return hit.position.equals(blockPos);
  }

  // ── Blok Arama ve Taramalar (Goal / AStar Arama Desteği) ─────────────

  /**
   * Octahedron tarama algoritmasıyla etraftaki blokları arar[cite: 11].
   */
  findBlocks(options: FindBlockOptions): Vec3[] {
    const matcher = typeof options.matching === "function"
      ? options.matching
      : (block: any) => {
          if (!block) return false;
          const targets = Array.isArray(options.matching) ? options.matching : [options.matching];
          return targets.includes(block.type);
        };

    const point = (options.point ?? new Vec3(0, 0, 0)).floored();
    const maxDistance = options.maxDistance ?? 16;
    const count = options.count ?? 1;
    const extraFilter = typeof options.useExtraInfo === "function" ? options.useExtraInfo : null;

    const start = new Vec3(Math.floor(point.x / 16), Math.floor(point.y / 16), Math.floor(point.z / 16));
    const it = new OctahedronIterator(start, Math.ceil((maxDistance + 8) / 16));
    const visitedSections = new Set<string>();

    let blocks: Vec3[] = [];
    let startedLayer = 0;
    let next = start;

    while (next) {
      const column = this.getColumn(next.x, next.z);
      const sectionY = next.y;

      if (column && !visitedSections.has(next.toString())) {
        const begin = new Vec3(next.x * 16, sectionY * 16, next.z * 16);
        const cursor = begin.clone();
        const end = cursor.offset(16, 16, 16);

        for (cursor.x = begin.x; cursor.x < end.x; cursor.x++) {
          for (cursor.y = begin.y; cursor.y < end.y; cursor.y++) {
            for (cursor.z = begin.z; cursor.z < end.z; cursor.z++) {
              if (cursor.distanceTo(point) <= maxDistance) {
                const block = this.getBlock(cursor);
                if (block && matcher(block) && (!extraFilter || extraFilter(block))) {
                  blocks.push(cursor.clone());
                }
              }
            }
          }
        }
        visitedSections.add(next.toString());
      }

      if (startedLayer !== it.apothem && blocks.length >= count) {
        break;
      }
      startedLayer = it.apothem;
      next = it.next();
    }

    blocks.sort((a, b) => a.distanceTo(point) - b.distanceTo(point));

    return blocks.length > count ? blocks.slice(0, count) : blocks;
  }

  /**
   * Kriterlere uyan en yakın tek bir bloğu döner[cite: 11].
   */
  findBlock(options: FindBlockOptions): any | null {
    const blocks = this.findBlocks(options);
    if (blocks.length === 0) return null;
    return this.getBlock(blocks[0]);
  }

  // ── İstatistik ────────────────────────────────────────────────────────

  get loadedColumnCount(): number {
    return this.columns.size;
  }
}