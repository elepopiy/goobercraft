declare const router: import("express-serve-static-core").Router;
/**
 * Anlık CPU/RAM metrikleriyle zenginleştirilmiş, GÜNCEL node listesini döner.
 * Hem GET /api/nodes hem de BotController'ın node seçim mantığı bu fonksiyonu kullanır,
 * böylece iki taraf da AYNI veriyi görür.
 */
export declare function getNodesList(): any[];
export default router;
//# sourceMappingURL=nodes.d.ts.map