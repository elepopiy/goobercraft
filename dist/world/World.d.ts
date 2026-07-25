import { Vec3 } from "vec3";
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
export declare class World {
    /** Anahtar: "chunkX,chunkZ" */
    private columns;
    private static columnKey;
    setColumn(chunkX: number, chunkZ: number, column: any): void;
    getColumn(chunkX: number, chunkZ: number): any | undefined;
    unloadColumn(chunkX: number, chunkZ: number): void;
    /**
     * Dünya koordinatlarındaki bloğu döner. Chunk yüklü değilse null döner.
     */
    getBlock(position: Vec3): any | null;
    /**
     * Belirli bir dünya koordinatındaki bloğun state ID'sini günceller.
     */
    setBlockStateId(position: Vec3, stateId: number): void;
    getBiome(position: Vec3): number | null;
    /**
     * Belirtilen doğrultuda raycast atarak temas edilen ilk katı bloğu ve yüzeyi tespit eder.
     */
    raycast(from: Vec3, direction: Vec3, maxDistance: number): RaycastHit | null;
    /**
     * İki nokta arasında engelleyici blok olup olmadığını test eder.
     */
    canSeeBlock(eyePos: Vec3, blockPos: Vec3, maxDistance?: number): boolean;
    /**
     * Octahedron tarama algoritmasıyla etraftaki blokları arar[cite: 11].
     */
    findBlocks(options: FindBlockOptions): Vec3[];
    /**
     * Kriterlere uyan en yakın tek bir bloğu döner[cite: 11].
     */
    findBlock(options: FindBlockOptions): any | null;
    get loadedColumnCount(): number;
}
//# sourceMappingURL=World.d.ts.map