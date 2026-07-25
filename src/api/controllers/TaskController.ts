import { Request, Response } from "express";

export class TaskController {

    public static getTasks(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            tasks: []

        });

    }

}