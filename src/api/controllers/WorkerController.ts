import { Request, Response } from "express";

export class WorkerController {

    public static getWorkers(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            workers: []

        });

    }

    public static registerWorker(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            message: "Worker kayıt sistemi hazırlanıyor."

        });

    }

}