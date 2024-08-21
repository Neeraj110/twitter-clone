import { Router } from "express";
import { follow } from "../controllers/follow.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/:id").get(isAuthenticated, follow);

export default router;
