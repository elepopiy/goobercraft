import { Router } from "express";

import status from "./status";
import bots from "./bots";
import nodes from "./nodes";
import workers from "./workers";
import tasks from "./tasks";
import dashboard from "./dashboard";
import auth from "./auth";

const router = Router();

router.use("/status", status);
router.use("/bots", bots);
router.use("/nodes", nodes);
router.use("/workers", workers);
router.use("/tasks", tasks);
router.use("/dashboard", dashboard);
router.use("/auth", auth);

export default router;