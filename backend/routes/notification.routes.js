import { Router } from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  changeReadStatus,
  AllNotifications,
  deleteNotificationById,
} from "../controllers/notification.controller.js";

const router = Router();

router.get("/all-notifications", isAuthenticated, AllNotifications);
router.get("/read/:id", isAuthenticated, changeReadStatus);
router.delete("/delete/:id", deleteNotificationById);

export default router;
