import { Request, Response } from "express";
import { NodeManager } from "../../managers/NodeManager";

// Projendeki NodeManager örneğini buraya aktarabilirsin
export class NodeController {
    public static nodeManager = new NodeManager();

    public static getNodes(req: Request, res: Response) {
        res.json({
            success: true,
            nodes: NodeController.nodeManager.getAll()
        });
    }
}