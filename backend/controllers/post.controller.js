import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import Notification from "../models/notification.model.js";

// ------------ CREATE POST CONTROLLER ------------ //

export const createPost = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { content } = req.body;
    const imageLocalPath = req.files?.image?.[0]?.path;
    const videoFileLocalPath = req.files?.video?.[0]?.path;

    const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB limit for images
    const MAX_VIDEO_SIZE = 17 * 1024 * 1024; // 17 MB limit for videos

    if (imageLocalPath && imageLocalPath.size > MAX_IMAGE_SIZE) {
      throw new ApiError(400, "Image size should not exceed 8MB");
    }

    if (videoFileLocalPath && videoFileLocalPath.size > MAX_VIDEO_SIZE) {
      throw new ApiError(400, "Video size should not exceed 17MB");
    }

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    let image = { url: "" };
    let video = { url: "" };

    if (imageLocalPath) {
      image = await uploadOnCloudinary(imageLocalPath, {
        folder: "posts",
      });
    }

    if (videoFileLocalPath) {
      video = await uploadOnCloudinary(videoFileLocalPath, {
        folder: "posts",
      });
    }

    const post = new Post({
      content,
      image: image?.url || "",
      video: video?.url || "",
      owner: req.user._id,
    });

    await post.save();
    user.posts.unshift(post._id);
    await user.save();

    return res
      .status(201)
      .json(new ApiResponse(201, post, "Post created successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ DELETE POST CONTROLLER ------------ //

export const deletePost = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;

    const post = await Post.findById(postId);
    const user = await User.findById(userId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to delete this post");
    }

    if (post.image) {
      await deleteOnCloudinary(post.image);
    }

    if (post.video) {
      await deleteOnCloudinary(post.video);
    }

    await Post.findByIdAndDelete(postId);
    await user.posts.pull(postId);
    await user.save();

    return res
      .status(200)
      .json(new ApiResponse(200, null, "Post deleted successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ UPDATE POST CONTROLLER ------------ //

export const updatePost = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const { postId } = req.params;
    const { content } = req.body;
    const imageLocalPath = req.files?.image?.[0]?.path;
    const videoFileLocalPath = req.files?.video?.[0]?.path;

    const MAX_IMAGE_SIZE = 8 * 1024 * 1024; // 8 MB limit for images
    const MAX_VIDEO_SIZE = 17 * 1024 * 1024; // 17 MB limit for videos

    if (imageLocalPath && imageLocalPath.size > MAX_IMAGE_SIZE) {
      throw new ApiError(400, "Image size should not exceed 8MB");
    }

    if (videoFileLocalPath && videoFileLocalPath.size > MAX_VIDEO_SIZE) {
      throw new ApiError(400, "Video size should not exceed 17MB");
    }

    if (!postId) {
      throw new ApiError(400, "Post id is required");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    if (post.owner.toString() !== userId.toString()) {
      throw new ApiError(403, "You are not authorized to update this post");
    }

    if (!content) {
      throw new ApiError(400, "Content is required");
    }

    let image,
      video = { url: "" };

    if (imageLocalPath) {
      await deleteOnCloudinary(post.image);
      image = await uploadOnCloudinary(imageLocalPath, {
        folder: "posts",
      });
    }

    if (videoFileLocalPath) {
      await deleteOnCloudinary(post.video);
      video = await uploadOnCloudinary(videoFileLocalPath, {
        folder: "posts",
      });
    }

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        content,
        image: image?.url || post.image,
        video: video?.url || post.video,
      },
      { new: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updatedPost, "Post updated successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ GET ALL POST CONTROLLER ------------ //

export const getAllPost = asyncHandler(async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate("owner comments.user");

    return res.status(200).json(new ApiResponse(200, posts, "All posts"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ GET POST BY ID CONTROLLER ------------ //

export const getPostById = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findById(postId).populate("owner  comments.user");

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    return res.status(200).json(new ApiResponse(200, post, "Post"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ GET POST OF FOLLOWING USERS CONTROLLER ------------ //

export const getPostOfFollowingUsers = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    //  Retrieve posts from users that the current user is following
    const posts = await Post.find({ owner: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate("owner  comments.user");

    return res.status(200).json(new ApiResponse(200, posts, "Posts"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ LIKE POST CONTROLLER ------------ //

export const likePost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    let notification;

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const isLiked = post.likes.includes(user._id.toString());

    if (isLiked) {
      post.likes = post.likes.filter(
        (likedId) => likedId.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);

      notification = await Notification.create({
        receiver: post.owner,
        sender: req.user,
        refPost: post,
        tag: `${req.user.username} is like your post`,
        message: "Liked the post",
      });
    }

    await post.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          notification,
          isLiked ? "Post unliked" : "Post liked"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ GET BOOKMARKED POSTS CONTROLLER ------------ //

export const bookmarkPost = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;

    const user = await User.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const isBookmarked = user.bookmarks.includes(post._id.toString());

    if (isBookmarked) {
      user.bookmarks = user.bookmarks.filter((bookmarked) => {
        bookmarked.toString() !== post._id.toString();
      });
    } else {
      user.bookmarks.unshift(post._id);
    }

    await user.save();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          isBookmarked ? "Post bookmarked removed" : "Post bookmarked added"
        )
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ ADD COMMENT CONTROLLER ------------ //

export const addComment = asyncHandler(async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user._id;
    const { comment } = req.body;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    post.comments.unshift({
      user: userId,
      comment,
    });

    const notification = await Notification.create({
      receiver: post.owner,
      sender: req.user,
      refPost: post,
      tag: ` ${req.user?.username} commented on post`,
      message: comment,
    });

    await post.save();

    return res
      .status(200)
      .json(new ApiResponse(200, notification, "Comment added"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------ DELETE COMMENT CONTROLLER ------------ //

export const deleteComment = asyncHandler(async (req, res) => {
  try {
    const { postId, commentId } = req.params;

    const post = await Post.findById(postId);

    if (!post) {
      throw new ApiError(404, "Post not found");
    }

    const comment = post.comments.find((c) => c._id.toString() === commentId);

    if (!comment) {
      throw new ApiError(404, "Comment not found");
    }

    post.comments.pull({ _id: commentId });

    await post.save();

    return res.status(200).json(new ApiResponse(200, post, "Comment deleted"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
