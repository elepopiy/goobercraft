import { Router } from "express";
import os from "os";

const router = Router();

// 10 Tane Hazır Rack (Node) Tanımlaması — statik iskelet, canlı metrikler her çağrıda hesaplanır
const baseNodes: any[] = Array.from({ length: 10 }, (_, index) => ({
  id: `master-node-${index + 1}`,
  name: `DataCenter Rack #${index + 1}`,
  maxBots: 10,
  online: true,
}));

/**
 * Anlık CPU/RAM metrikleriyle zenginleştirilmiş, GÜNCEL node listesini döner.
 * Hem GET /api/nodes hem de BotController'ın node seçim mantığı bu fonksiyonu kullanır,
 * böylece iki taraf da AYNI veriyi görür.
 */
export function getNodesList(): any[] {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));

  const cpus = os.cpus().length || 1;
  const load = os.loadavg()[0] || 0;
  const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 8, 100);

  return baseNodes.map((node) => ({
    ...node,
    cpuUsage: cpuPercent,
    ramUsage: `${Math.round(usedMemMB / baseNodes.length)} MB`, // Rack başına ortalama yük dağılımı
  }));
}

router.get("/", (req, res) => {
  const updatedNodes = getNodesList();

  return res.json({
    success: true,
    count: updatedNodes.length,
    nodes: updatedNodes,
  });
});

export default router;