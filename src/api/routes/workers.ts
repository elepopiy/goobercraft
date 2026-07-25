import { Router } from "express";

const router = Router();

router.get("/", (_, res) => {

    res.json({

        success: true,

        workers: []

    });

});

router.post("/register", (_, res) => {

    res.json({

        success: true,

        message: "Worker kayıt sistemi hazırlanıyor."

    });

});

export default router;