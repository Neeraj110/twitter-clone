import { Router } from "express";
import {
  forgotPassword,
  register,
  resetPassword,
  verifyOTP,
  login,
  logout,
  deleteUser,
  updateProfile,
  updateUserAvatar,
  deleteUserAvatar,
  getMyProfile,
  getAllUsers,
  getMyPosts,
  getUserPost,
  getUserByName,
  getAllSearch,
  getUserById,
  updateUserCoverImg,
  getMyBookmarks,
} from "../controllers/auth.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// post
router.route("/signup").post(register);
router.route("/verify").post(verifyOTP);
router.route("/forgot-password").post(forgotPassword);
router.route("/reset-password").post(resetPassword);
router.route("/login").post(login);
router.route("/logout").post(isAuthenticated, logout);

// delete
router.route("/delete-user").delete(isAuthenticated, deleteUser);
router.route("/delete-avatar").delete(isAuthenticated, deleteUserAvatar);

// patch

router.route("/update-profile").patch(
  isAuthenticated,
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImg",
      maxCount: 1,
    },
  ]),
  updateProfile
);
router
  .route("/update-avatar")
  .patch(isAuthenticated, upload.single("avatar"), updateUserAvatar);
router
  .route("/update-cover-img")
  .patch(isAuthenticated, upload.single("coverImg"), updateUserCoverImg);

//get
router.route("/get-profile").get(isAuthenticated, getMyProfile);
router.route("/get-alluser").get(isAuthenticated, getAllUsers);
router.route("/me/post").get(isAuthenticated, getMyPosts);
router.route("/post/:id").get(isAuthenticated, getUserPost);
router.route("/find/:username").get(isAuthenticated, getUserByName);
router.route("/search").get(isAuthenticated, getAllSearch);
router.route("/:userId").get(isAuthenticated, getUserById);
router.route("/me/bookmarks").get(isAuthenticated, getMyBookmarks);

export default router;
