import { Request, Response } from "express";

export class StatusController {

    public static getStatus(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            data: {

                online: true,

                uptime: process.uptime(),

                memory: process.memoryUsage(),

                cpu: process.cpuUsage(),

                node: process.version,

                platform: process.platform

            }

        });

    }

}