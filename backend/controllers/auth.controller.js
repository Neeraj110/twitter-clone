import User from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { sendMail } from "../services/emailService.js";
import { generateOTP } from "../utils/generateOtp.js";
import { deleteOnCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import { isValidObjectId } from "mongoose";
import Post from "../models/post.model.js";

const options = {
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

const generateAccessTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.getJwtToken();
    return { accessToken };
  } catch (error) {
    throw new ApiError(500, "something went wrong in tokens");
  }
};

let OTP, user;

export const register = asyncHandler(async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "User already exists"));
    }

    OTP = generateOTP();

    await sendMail({
      email,
      subject: "Welcome to TwiLite! Confirm Your Account",
      message: `Hi ${name},
      
      To get started and confirm your account, please use the verification code below:

      Verification Code: ${OTP}`,
    });

    user = new User({
      email,
      password,
      name,
      username,
      followers: [],
      following: [],
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "OTP sent to your email"));
  } catch (error) {
    console.error("Error in register:", error); // Log the error
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, error.message || "Internal Server Error")
      );
  }
});

// ------------------------ Verify OTP ------------------------//

export const verifyOTP = asyncHandler(async (req, res) => {
  try {
    const { otp } = req.body;

    if (otp !== OTP) {
      throw new ApiError(400, "Invalid OTP");
    }

    user.isverify = true; // Mark user as verified
    await user.save();

    const { accessToken } = await generateAccessTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, user, "User verified"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Forgot Password ------------------------//

export const forgotPassword = asyncHandler(async (req, res) => {
  try {
    const { email } = req.body;
    OTP = generateOTP();

    await sendMail({
      email,
      subject: "Reset password",
      message: ` 
       We received a request to reset your  password. Use the verification code below to proceed with resetting your password: 

      Verification Code: ${OTP}
`,
    });

    return res
      .status(200)
      .json(new ApiResponse(200, null, "otp sent to your email"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Reset Password ------------------------//

export const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (otp !== OTP) {
      throw new ApiError(400, "Invalid OTP");
    }

    const user = await User.findOne({ email }).select("-password");

    if (!user) {
      throw new ApiError(400, "User with this email does not exist");
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    const { accessToken } = await generateAccessTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, user, "Password reset successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Login ------------------------//

export const login = asyncHandler(async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new ApiError(400, "All fields are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
      throw new ApiError(404, "user not found");
    }

    const isMatch = await user.isPasswordCorrect(password, user.password);

    if (!isMatch) {
      throw new ApiError(400, "Invalid password");
    }

    const { accessToken } = await generateAccessTokens(user._id);

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json(new ApiResponse(200, user, "User logged in successfully"));
  } catch (error) {
    res.status(500).json(new ApiResponse(400, null, error.message));
  }
});

// ------------------------ Logout ------------------------//

export const logout = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .clearCookie("accessToken", { httpOnly: true, secure: true })
      .json(new ApiResponse(200, user, `User Loggout Successfully`));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Delete User ------------------------//

export const deleteUser = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Delete all posts created by the user
    const userPosts = await Post.find({ author: userId });
    for (const post of userPosts) {
      // Delete all images and videos associated with the post
      for (const image of post.images) {
        await deleteOnCloudinary(image.public_id); // Assuming images have a public_id for cloudinary deletion
      }
      for (const video of post.videos) {
        await deleteVideoOnCloudinary(video.public_id); // Assuming videos have a public_id for cloudinary deletion
      }
      await post.remove();
    }

    // Delete all likes made by the user
    await Like.deleteMany({ user: userId });

    // Delete all comments made by the user
    await Comment.deleteMany({ user: userId });

    // Remove user from all followers' and following lists
    await User.updateMany(
      { followers: userId },
      { $pull: { followers: userId } }
    );
    await User.updateMany(
      { following: userId },
      { $pull: { following: userId } }
    );

    // Delete all messages sent and received by the user
    await Message.deleteMany({
      $or: [{ sender: userId }, { receiver: userId }],
    });

    // Delete the user document
    await user.remove();

    return res
      .status(200)
      .json(
        new ApiResponse(
          200,
          null,
          "User and all associated data deleted successfully"
        )
      );
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Update Profile ------------------------//

export const updateProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { about, dob, location, link, name } = req.body;
    const avatarFilePath = req.files?.avatar?.[0]?.path;
    const coverImgFilePath = req.files?.coverImg?.[0]?.path; // Ensure this matches the field name in the router

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId).select("-password");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Handle avatar upload
    if (avatarFilePath) {
      const previousAvatar = user.avatar;
      if (previousAvatar && previousAvatar !== "") {
        await deleteOnCloudinary(previousAvatar);
      }
      const avatar = await uploadOnCloudinary(avatarFilePath, {
        folder: "avatars",
      });
      user.avatar = avatar?.url || "";
    }

    // Handle cover image upload
    if (coverImgFilePath) {
      const previousCoverImg = user.coverImg;
      if (previousCoverImg && previousCoverImg !== "") {
        await deleteOnCloudinary(previousCoverImg);
      }
      const coverImg = await uploadOnCloudinary(coverImgFilePath, {
        folder: "coverImgs",
      });
      user.coverImg = coverImg?.url || "";
    }

    // Update user profile details
    user.name = name || user.name;
    user.description = {
      about: about || "",
      dob: dob || "",
      location: location || "",
      link: link || "",
    };

    await user.save();

    return res.status(200).json({
      status: "success",
      message: "Profile updated successfully",
      data: user,
    });
  } catch (error) {
    console.log(error);
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Update User Avatar ------------------------//

export const updateUserAvatar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const avatarFilePath = req.file?.path;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    if (!avatarFilePath) {
      throw new ApiError(400, "Avatar is required!");
    }

    const user = await User.findById(userId).select("-password ");

    // delete previous avatar from cloudinary
    const previousAvatar = user.avatar;
    if (previousAvatar && previousAvatar !== "") {
      await deleteOnCloudinary(previousAvatar);
    }
    // upload new avatar on cloudinary
    const avatar = await uploadOnCloudinary(avatarFilePath, {
      folder: "avatars",
    });
    // save avatar in db
    user.avatar = avatar?.url;

    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated successfully!"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Update Profile Images ------------------------//

// ----------------------- update cover Img ------------------------//

export const updateUserCoverImg = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const CoverImgFilePath = req.file?.path;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    if (!CoverImgFilePath) {
      throw new ApiError(400, "Avatar is required!");
    }

    const user = await User.findById(userId).select("-password ");

    // delete previous avatar from cloudinary
    const previousCoverImg = user.coverImg;
    if (previousCoverImg && previousCoverImg !== "") {
      await deleteOnCloudinary(previousCoverImg);
    }

    // upload new avatar on cloudinary
    const coverImg = await uploadOnCloudinary(CoverImgFilePath, {
      folder: "coverImg",
    });
    // console.log(avatar);

    // save avatar in db
    user.coverImg = coverImg?.url;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar updated successfully!"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ Delete User Avatar ------------------------//

export const deleteUserAvatar = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId).select("-password");

    // delete avatar from cloudinary

    const avatar = user.avatar.public_id;
    if (avatar) {
      await deleteOnCloudinary(avatar);
    }

    user.avatar = "";
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .json(new ApiResponse(200, user, "Avatar deleted successfully!"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ getMyProfile ------------------------//

export const getMyProfile = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const user = await User.findById(userId)
      .select("-password")
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar")
      .populate({
        path: "posts",
        populate: { path: "owner" },
      })
      .populate({
        path: "bookmarks",
        populate: { path: "owner" },
      });

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ getAllUsers ------------------------//
export const getAllUsers = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const users = await User.find({ _id: { $ne: userId } })
      .sort({ createdAt: -1 })
      .populate("posts")
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar");

    // const users = await User.find({ _id: { $ne: userId } })
    //   .sort({ createdAt: -1 })
    //   .select("-password")
    //   .populate("posts followers following bookmarks");

    if (!users) {
      throw new ApiError(404, "Users not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "All users fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ getMyPosts ------------------------//

export const getMyPosts = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("comments.user owner");

    if (!posts) {
      throw new ApiError(404, "Posts not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "User posts fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ getUserPost ------------------------//

export const getUserPost = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user id");
    }

    const posts = await Post.find({ owner: userId })
      .sort({ createdAt: -1 })
      .populate("comments.user", "name username avatar")
      .populate("owner", "name username avatar followers following ");

    if (!posts) {
      throw new ApiError(404, "Posts not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, posts, "User posts fetched successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

// ------------------------ getUserPost ------------------------//

export const getUserByName = asyncHandler(async (req, res) => {
  try {
    const { username } = req.params; // Extract name from query parameters

    if (!username) {
      throw new ApiError(400, "username is required");
    }

    const user = await User.findOne({ username: username })
      .select("-password")
      .populate("followers", "name username avatar")
      .populate("following", "name username avatar")
      .populate("posts");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User retrieved successfully"));
  } catch (error) {
    throw new ApiError(500, error.message);
  }
});

// ------------------------ getAllSearch ------------------------//

export const getAllSearch = asyncHandler(async (req, res) => {
  try {
    const { name, username } = req.query;
    const queryObject = {};

    if (name) queryObject.name = new RegExp(name, "i"); // Case-insensitive search
    if (username) queryObject.username = new RegExp(username, "i"); // Case-insensitive search

    const users = await User.find(queryObject)
      .select("-password")
      .populate("posts followers following bookmarks")
      .sort({ createdAt: -1 });

    if (users.length === 0) {
      throw new ApiError(404, "No users found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, users, "Users retrieved successfully"));
  } catch (error) {
    return res
      .status(error.statusCode || 500)
      .json(
        new ApiError(
          error.statusCode || 500,
          error.message || "Internal Server Error"
        )
      );
  }
});

// ------------------------ getUserById ------------------------//

export const getUserById = asyncHandler(async (req, res) => {
  try {
    const userId = req.params.userId;

    console.log(req.params.userId);
    console.log("User ID:", userId); // Log user id

    const user = await User.findById(userId)
      .select("-password")
      .populate("posts followers following bookmarks");

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "User profile fetched successfully"));
  } catch (error) {
    throw new ApiError(400, "Invalid user id");
  }
});

// export const getMyBookmarks = async (req, res) => {
//   try {
//     const userId = req.user._id;
//     const user = await User.findById(userId);
//     const posts = [];

//     for (let i = 0; i < user.bookmarks.length; i++) {
//       const bookmark = await Post.findById(user.bookmarks[i]).populate(
//         "likes comments.user owner"
//       );
//       posts.push(bookmark);
//     }

//     res.status(200).json(new ApiResponse(200, posts, "Bookmarks fetched"));
//   } catch (error) {
//     throw new ApiError(400, error.message);
//   }
// };

export const getMyBookmarks = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user with populated bookmarks in a single query
    const user = await User.findById(userId).populate({
      path: "bookmarks",
      populate: [{ path: "owner" }],
    });

    if (!user) {
      return res.status(404).json(new ApiError(404, "User not found"));
    }

    res
      .status(200)
      .json(
        new ApiResponse(200, user.bookmarks, "Bookmarks fetched successfully")
      );
  } catch (error) {
    res.status(400).json(new ApiError(400, error.message));
  }
};
