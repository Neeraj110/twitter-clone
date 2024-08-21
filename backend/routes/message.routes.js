import { Router } from "express";
import {
  sendMessage,
    getMessages,
} from "../controllers/messages.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

router.route("/send/:receiverId").post(
  isAuthenticated,
  upload.fields([
    {
      name: "image",
      maxCount: 1,
    },
    {
      name: "video",
      maxCount: 1,
    },
  ]),
  sendMessage
);
 router.get("/get-msg/:receiverId", isAuthenticated, getMessages);

export default router;
