import { Request, Response } from "express";
import { manager } from "../../managers";
import os from "os";

export class NodeController {
  public static getNodes(req: Request, res: Response) {
    // 1. Master Node yoksa anında canlı kaydet
    let nodesList = manager.nodes.getAllNodes();

    if (!nodesList || nodesList.length === 0) {
      manager.nodes.registerNode({
        id: "master-node-1",
        name: "GooberCraft Master Node",
        url: "http://localhost:10000",
        maxBots: 10
      });
      nodesList = manager.nodes.getAllNodes();
    }

    // 2. Gerçek CPU ve RAM kullanımını canlı hesapla
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
    
    // CPU Oranı (loadavg üzerinden basit orantı)
    const cpus = os.cpus().length;
    const load = os.loadavg()[0];
    const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 5, 100);

    // Her bir Node objesine gerçek metrikleri ekle
    const enrichedNodes = nodesList.map(node => ({
      ...node,
      online: true,
      cpuUsage: cpuPercent,
      ramUsage: `${usedMemMB} MB`
    }));

    return res.json({
      success: true,
      count: enrichedNodes.length,
      nodes: enrichedNodes
    });
  }
}