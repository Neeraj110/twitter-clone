import { Router } from "express";
import {
  createPost,
  deletePost,
  getAllPost,
  getPostById,
  updatePost,
  deleteComment,
  addComment,
  getPostOfFollowingUsers,
  likePost,
  bookmarkPost,
} from "../controllers/post.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

// Post
router.route("/create-post").post(
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
  createPost
);

router.route("/delete-post/:postId").delete(isAuthenticated, deletePost);
router.route("/update-post/:postId").patch(
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
  updatePost
);

router.route("/bookmark/:postId").post(isAuthenticated, bookmarkPost);

// get posts
router.route("/get-allpost").get(isAuthenticated, getAllPost);
router.route("/get-post/:postId").get(isAuthenticated, getPostById);
router
  .route("/get-following-post")
  .get(isAuthenticated, getPostOfFollowingUsers);

// Like
router.route("/like-post/:postId").patch(isAuthenticated, likePost);

// Comment
router.route("/add-comment/:postId").post(isAuthenticated, addComment);
router
  .route("/delete-comment/:postId/:commentId")
  .delete(isAuthenticated, deleteComment);
export default router;
