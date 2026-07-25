import { Request, Response } from "express";

export class BotController {

    public static getBots(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            bots: []

        });

    }

    public static createBot(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            message: "Bot oluşturma sistemi hazırlanıyor."

        });

    }

    public static stopBot(
        req: Request,
        res: Response
    ) {

        res.json({

            success: true,

            message: "Bot durdurma sistemi hazırlanıyor."

        });

    }

}