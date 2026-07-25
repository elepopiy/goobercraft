import { Request, Response } from "express";
import { manager } from "../../managers"; // ✅ İki üst klasöre çıkıldığından emin olundu

export class NodeController {
  public static register(req: Request, res: Response) {
    const { id, name, url, maxBots } = req.body;

    if (!id || !url) {
      return res.status(400).json({
        success: false,
        message: "Node 'id' ve 'url' bilgisi zorunludur!"
      });
    }

    const node = manager.nodes.registerNode({
      id,
      name,
      url,
      maxBots: maxBots ? Number(maxBots) : 10
    });

    return res.json({
      success: true,
      message: `Node '${node.id}' başarıyla kaydedildi.`,
      node
    });
  }

  public static getNodes(req: Request, res: Response) {
    return res.json({
      success: true,
      nodes: manager.nodes.getAllNodes()
    });
  }
}