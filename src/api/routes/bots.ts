import { Router } from "express";
import { BotController } from "../controllers/BotController";

const router = Router();

router.get("/", BotController.getBots);

router.post("/create", BotController.createBot);

router.post("/stop", BotController.stopBot);

export default router;