import { Vec3 } from "vec3";
import { World } from "./World";
import { RaycastResult } from "../utils/types";
/**
 * Amanatides & Woo "A Fast Voxel Traversal Algorithm" temel alınarak
 * yazılmış grid-tabanlı raycast. Işın, karşılaştığı ilk "hava olmayan"
 * (boş olmayan) bloğa çarpana kadar voksel voksel ilerler.
 */
export declare function raycast(world: World, origin: Vec3, direction: Vec3, maxDistance: number, isSolid?: (block: any) => boolean): RaycastResult | null;
//# sourceMappingURL=Raycast.d.ts.map