import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      minlength: 1, // Ensure that messages are not empty
      maxlength: 500, // Optional: Limit message length
    },
    image: {
      type: String,
      default: null, // Allow for messages without images
    },
    video: {
      type: String,
      default: null, // Allow for messages without videos
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);


// Optional: Adding indexes for better query performance
messageSchema.index({ senderId: 1, receiverId: 1 });
messageSchema.index({ receiverId: 1 });

const Message = mongoose.model("Message", messageSchema);

export default Message;
