import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {

    res.json({

        success: true,

        dashboard: {

            bots: 0,
            workers: 0,
            nodes: 0,
            cpu: 0,
            ram: process.memoryUsage().rss

        }

    });

});

export default router;