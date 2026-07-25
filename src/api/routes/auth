import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const router = Router();

// Hesap oluşturma
router.post("/register", (req, res) => {
  AuthController.register(req, res);
});

// Giriş yapma
router.post("/login", (req, res) => {
  AuthController.login(req, res);
});

export default router;