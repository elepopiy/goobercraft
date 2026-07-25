import { Router } from "express";
import { BotController } from "../controllers/BotController";

const router = Router();

// Bot Listeleme Endpoint'i
router.get("/", (req, res) => {
  BotController.getBots(req, res);
});

// Bot Oluşturma Endpoint'i
router.post("/create", (req, res) => {
  BotController.create(req, res);
});

// Bot Durdurma Endpoint'i
router.post("/stop", (req, res) => {
  BotController.stop(req, res);
});

export default router;