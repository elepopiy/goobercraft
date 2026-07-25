import { Request, Response } from "express";

export class NodeController {

    public static getNodes(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            nodes: []

        });

    }

}