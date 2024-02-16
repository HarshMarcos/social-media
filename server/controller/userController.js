import asyncHandler from "../middleware/asyncHandler.js";
import userModel from "../model/user.js";
import AppError from "../util/error.js";
import cloudinary from "cloudinary";
import fs from "fs/promises";
import postModel from "../model/post.js";
const getProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 400));
  }
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully!",
  });
});

const editProfile = asyncHandler(async (req, res, next) => {
  const { id } = req.user;

  const { fullname, username, bio } = req.body;

  const user = await userModel.findById(id);

  if (!user) {
    return next(new AppError("User not found", 400));
  }

  if (fullname) {
    user.fullname = fullname;
  }

  if (username) {
    const usernameExists = await userModel.findOne({ username });

    if (usernameExists) {
      return next(new AppError("Username already taken", 400));
    }

    user.username = username;
  }

  if (bio) {
    user.bio = bio;
  }

  if (req.file) {
    try {
      await cloudinary.v2.uploader.destroy(user.avatar.public_id);

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "SpeakWave_Users",
        width: 250,
        height: 250,
        gravity: "faces",
        crop: "fill",
      });

      if (result) {
        user.avatar.public_id = result.public_id;
        user.avatar.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading file", 500));
    }
  }
  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});

const getUsers = asyncHandler(async (req, res, next) => {
  const users = await userModel.find();

  res.status(200).json({
    success: true,
    message: "Users fetched successfully",
    users,
  });
});

const getUserProfile = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  if (!userId) {
    return next(new AppError("User id is required", 400));
  }

  const userExists = await userModel.findById(userId);

  if (!userExists) {
    return next(new AppError("User doesnt exists with given Id", 404));
  }

  const postsByUser = await postModel
    .find({
      postedBy: userId,
    })
    .populate("postedBy", "username avatar");

  const userData = {
    userDetails: userExists,
    postsByUser,
  };

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: userData,
  });
});

const followUser = asyncHandler(async (req, res, next) => {
  const { userId } = req.params; // User ID of the user to follow

  const { id } = req.user;

  if (id.toString() === userId.toString()) {
    return next(new AppError("Soory, you can't follow ownself", 400));
  }

  const currentUser = await userModel.findById(id);

  // Check if the user to follow exists
  const userToFollow = await userModel.findById(userId);

  if (!userToFollow) {
    return next(new AppError("User not found", 404));
  }

  if (currentUser.following.includes(userId)) {
    return next(new AppError("You already following this user"));
  }

  // Add the user in following's array of the current user
  currentUser.following.push(userId);
  await currentUser.save();

  // Add the current user in the followers's array of the user to follow
  userToFollow.follower.push(currentUser._id);

  await userToFollow.save();

  res.status(200).json({
    success: true,
    message: `You'are now following ${userToFollow.username}`,
  });
});

export { getProfile, editProfile, getUsers, getUserProfile, followUser };
