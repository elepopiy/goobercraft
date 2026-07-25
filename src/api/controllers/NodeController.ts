import { Request, Response } from "express";
import { manager } from "../../managers";

export class NodeController {
  public static getNodes(req: Request, res: Response) {
    let nodesList = manager.nodes.getAllNodes();

    // GARANTİ KONTROLÜ: Eğer liste boşsa Master Node'u anında hafızaya yeniden kaydet
    if (!nodesList || nodesList.length === 0) {
      manager.nodes.registerNode({
        id: "master-node-1",
        name: "GooberCraft Master Node",
        url: "http://localhost:10000",
        maxBots: 10
      });
      nodesList = manager.nodes.getAllNodes();
    }

    return res.json({
      success: true,
      count: nodesList.length,
      nodes: nodesList
    });
  }
}