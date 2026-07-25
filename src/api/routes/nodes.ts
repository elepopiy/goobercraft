import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {

    res.json({

        success: true,

        nodes: []

    });

});

export default router;