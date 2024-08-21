import User from "../models/user.model.js";
import Conversation from "../models/coversation.model.js";
import Message from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { uploadOnCloudinary, deleteOnCloudinary } from "../utils/cloudinary.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = asyncHandler(async (req, res) => {
  try {
    const { text } = req.body;
    const receiverId = req.params.receiverId;
    const senderId = req.user._id;

    const imageLocalPath = req.files?.image?.[0]?.path;
    const videoFileLocalPath = req.files?.video?.[0]?.path;

    const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
    const MAX_VIDEO_SIZE = 20 * 1024 * 1024;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    if (!text) {
      throw new ApiError(400, "Message should not be empty");
    }
    if (imageLocalPath && imageLocalPath.size > MAX_IMAGE_SIZE) {
      throw new ApiError(400, "Image size should not exceed 8MB");
    }

    if (videoFileLocalPath && videoFileLocalPath.size > MAX_VIDEO_SIZE) {
      throw new ApiError(400, "Video size should not exceed 17MB");
    }

    let image,
      video = { url: "" };

    if (imageLocalPath) {
      image = await uploadOnCloudinary(imageLocalPath, {
        folder: "messages",
      });
    }

    if (videoFileLocalPath) {
      video = await uploadOnCloudinary(videoFileLocalPath, {
        folder: "messages",
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      image: image?.url || "",
      video: video?.url || "",
      text,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
    }

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res
      .status(201)
      .json(new ApiResponse(201, newMessage, "Message sent successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

export const getMessages = asyncHandler(async (req, res) => {
  try {
    const receiverId = req.params.receiverId;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    }).populate("messages");

    if (!conversation) {
      return res
        .status(200)
        .json(new ApiResponse(200, [], "No messages found"));
    }

    const messages = conversation.messages;

    res
      .status(200)
      .json(new ApiResponse(200, messages, "messages retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});
