import { Request, Response } from "express";
import { manager } from "../../managers";
import os from "os";

export class NodeController {
  public static getNodes(req: Request, res: Response) {
    let nodesList = manager.nodes.getAllNodes();

    // 1. Master Node yoksa kaydet
    if (!nodesList || nodesList.length === 0) {
      manager.nodes.registerNode({
        id: "master-node-1",
        name: "GooberCraft Master Node",
        url: "http://localhost:10000",
        maxBots: 10
      });
      nodesList = manager.nodes.getAllNodes();
    }

    // 2. Sistem Yükünü ve CPU/RAM Kullanımını Hesapla
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const usedMemMB = Math.round((totalMem - freeMem) / (1024 * 1024));
    
    const cpus = os.cpus().length || 1;
    const load = os.loadavg()[0] || 0;
    const cpuPercent = Math.min(Math.round((load / cpus) * 100) || 12, 100);

    // Her bir Node kasasına canlı metrik verilerini entegre et
    const enrichedNodes = nodesList.map(node => ({
      ...node,
      online: true,
      cpuUsage: cpuPercent,
      ramUsage: `${usedMemMB} MB`,
      maxBots: node.maxBots || 10
    }));

    return res.json({
      success: true,
      count: enrichedNodes.length,
      nodes: enrichedNodes
    });
  }
}