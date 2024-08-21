import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import Notification from "../models/notification.model.js";

export const follow = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const targetUser = await User.findById(id);
  if (!targetUser) {
    return next(new ApiError(404, "User not found"));
  }

  const currentUser = await User.findById(req.user?._id);
  if (targetUser._id.toString() === currentUser._id.toString()) {
    return next(new ApiError(400, "Cannot follow yourself"));
  }

  const isFollowing = currentUser.following.includes(id);

  if (isFollowing) {
    // Unfollow logic
    currentUser.following = currentUser.following.filter(
      (item) => item.toString() !== targetUser._id.toString()
    );
    targetUser.followers = targetUser.followers.filter(
      (item) => item.toString() !== currentUser._id.toString()
    );
  } else {
    // Follow logic
    currentUser.following.push(targetUser._id);
    targetUser.followers.push(currentUser._id);

    await Notification.create({
      receiver: targetUser._id,
      sender: req.user._id,
      tag: `${req.user.name} started following you`,
      message: "Followed successfully",
    });
  }

  await currentUser.save();
  await targetUser.save();

  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        isFollowing ? "Unfollowed successfully" : "Followed successfully"
      )
    );
});
