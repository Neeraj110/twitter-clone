import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getUsersForSidebar } from "../controllers/user.controller.js";

const router = Router();

router.get("/info", isAuthenticated, getUsersForSidebar);

export default router;
