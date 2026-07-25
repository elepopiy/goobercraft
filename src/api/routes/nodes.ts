import { Router } from "express";
import os from "os";

const router = Router();

// 10 Tane Hazır Rack (Node) Tanımlaması
export const nodesList: any[] = Array.from({ length: 10 }, (_, index) => ({
  id: `master-node-${index + 1}`,
  name: `DataCenter Rack #${index + 1}`,
  maxBots: 10,
  online: true,
  cpuUsage: 0,
  ramUsage: "0 MB"
}));

router.get("/", (req, res) => {
  // Gerçek Sistem RAM & CPU Metriklerini Hesapla
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
  
  const cpus = os.cpus().length;
  const load = os.loadavg()[0];
  const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 8, 100);

  // Bütün Rack'lerin canlı metriklerini güncelle
  const updatedNodes = nodesList.map(node => ({
    ...node,
    cpuUsage: cpuPercent,
    ramUsage: `${Math.round(usedMemMB / 10)} MB` // Rack başına ortalama yük dağılımı
  }));

  return res.json({
    success: true,
    count: updatedNodes.length,
    nodes: updatedNodes
  });
});

export default router;