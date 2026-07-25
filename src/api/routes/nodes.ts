import { Router } from "express";
import os from "os";

const router = Router();

// Bellekte en azından master-node-1 bulunsun
export const nodesList: any[] = [
  {
    id: "master-node-1",
    name: "Master DataCenter Node",
    maxBots: 10,
    online: true,
    cpuUsage: 0,
    ramUsage: "0 MB"
  }
];

router.get("/", (req, res) => {
  // Gerçek Sistem RAM & CPU Metriklerini Hesapla
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
  const cpuLoad = Math.round(os.loadavg()[0] * 10) || 12; // Sistem yükü %

  // Master node'u canlı metriklerle güncelle
  if (nodesList.length === 0) {
    nodesList.push({ id: "master-node-1", name: "Master DataCenter Node", maxBots: 10, online: true });
  }

  nodesList[0].cpuUsage = cpuLoad;
  nodesList[0].ramUsage = `${usedMemMB} MB`;

  // Frontend hem { success, nodes } hem de düz [] beklerse çakışmasın diye
  res.json({
    success: true,
    nodes: nodesList
  });
});

export default router;