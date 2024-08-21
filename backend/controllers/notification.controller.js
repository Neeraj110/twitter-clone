import Notification from "../models/notification.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";

// Fetch all notifications for the logged-in user
export const AllNotifications = asyncHandler(async (req, res) => {
  try {
    // Get status query parameter
    const { status } = req.query;
    const query = {
      receiver: req.user._id,
    };

    if (status) {
      query.unread = status;
    }

    const notifications = await Notification.find(query)
      .populate("receiver sender refPost")
      .sort({ createdAt: -1 })
      .exec();

    // Send response with notifications data
    return res
      .status(200)
      .json(
        new ApiResponse(
          true,
          notifications,
          "Notifications fetched successfully"
        )
      );
  } catch (error) {
    // Handle any errors that occur during the fetch
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Change read status of a notification
export const changeReadStatus = asyncHandler(async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);

    if (!notification) {
      return res
        .status(404)
        .json(new ApiResponse(false, "Notification not found"));
    }

    notification.unread = false;
    await notification.save();

    return res
      .status(200)
      .json(
        new ApiResponse(true, notification, "Read status changed successfully")
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// Delete a specific notification by ID
export const deleteNotificationById = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
      return res
        .status(404)
        .json(new ApiResponse(false, "Notification not found"));
    }

    await Notification.findByIdAndDelete(id);

    return res
      .status(200)
      .json(
        new ApiResponse(true, notification, "Notification deleted successfully")
      );
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
