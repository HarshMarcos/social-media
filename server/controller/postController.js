import asyncHandler from "../middleware/asyncHandler.js";
import AppError from "../util/error.js";
import cloudinary from "cloudinary";
import userModel from "../model/user.js";
import postModel from "../model/post.js";
import fs from "fs/promises";

const createPost = asyncHandler(async (req, res, next) => {
  const { content } = req.body;

  if (!content && !req.file) {
    return next(new AppError("Please add something before posting", 400));
  }

  const thumbnail = {};

  if (req.file) {
    try {
      const isImage = req.file.mimetype.startsWith("image");
      const setFolder = isImage
        ? "SpeakWave_Post_Images"
        : "SpeakWave_Posts_Videos";
      const resourceType = isImage ? "image" : "video";

      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: setFolder,
        resource_type: resourceType,
      });

      if (result) {
        thumbnail.public_id = result.public_id;
        thumbnail.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading thumbnail", 500));
    }
  }

  const post = await postModel.create({
    content,
    thumbnail,
    postedBy: req.user.id,
  });

  res.status(201).json({
    success: true,
    message: "Thank you for sharing your post.",
    post,
  });
});

const fetchPosts = asyncHandler(async (req, res, next) => {
  const posts = await postModel
    .find()
    .populate({
      path: "comments",
      populate: {
        path: "commentedBy",
        select: "username avatar",
      },
    })
    .populate("postedBy", "username avatar");

  if (posts.length === 0) {
    return next(new AppError("No Posts found", 400));
  }

  res.status(200).json({
    success: true,
    message: "Posts fetched successfully",
    posts,
  });
});

const fetchPostById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const post = await postModel
    .findById(id)
    .populate("postedBy", "username avatar");

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "Post fetched successfully",
    post,
  });
});

const editPost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const { content } = req.body;

  const post = await postModel.findById(id);

  if (!post) {
    return next(new AppError("Post not found", 404));
  }

  if (content) {
    post.content = content;
  }

  if (req.file) {
    try {
      await cloudinary.v2.uploader.destroy(post.thumbnail.public_id);

      // Upload new thumbnail
      const result = await cloudinary.v2.uploader.upload(req.file.path, {
        folder: "SpeakWave_Posts",
      });

      if (result) {
        post.thumbnail.public_id = result.public_id;
        post.thumbnail.secure_url = result.secure_url;

        fs.rm(`uploads/${req.file.filename}`);
      }
    } catch (error) {
      return next(new AppError("Error while uploading post thumbnail", 500));
    }
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    post,
  });
});

const removePost = asyncHandler(async (req, res, next) => {
  const { id } = req.params;

  const postExists = await userModel.findById(id);

  const repostDocumnets = await userModel.find({
    repost: postExists._id,
  });

  if (!postExists) {
    return next(new AppError("Post not found", 404));
  }

  if (postExists.thumbnail && postExists.thumbnail.public_id) {
    await cloudinary.v2.uploader.destroy(postExists.thumbnail.public_id);
  }

  const isDeleted = await postModel.findByIdAndDelete(id);

  if (isDeleted) {
    // updating user's reposted post
    await userModel.updateMany({ repost: id }, { $pull: { repost: id } });
  }

  res.status(200).json({
    success: true,
    message: "Post deleted successfully.",
  });
});

const repostPost = asyncHandler(async (req, res, next) => {
  const { id: userId } = req.user;

  const { id } = req.params;

  const user = await userModel.findById(userId);

  const post = await postModel.findById(id);

  if (!user || !post) {
    return next(new AppError("User or post not found", 400));
  }

  if (user.repost.includes(id)) {
    return next(
      new AppError("You can't repost the thread more than one time.", 400)
    );
  }

  user.repost.push(post);
  await user.save();

  post.numberOfRepost = post.numberOfRepost + 1;

  await post.save();

  res.status(201).json({
    success: true,
    message: "Post reposted successfully",
  });
});

const fetchRepost = asyncHandler(async (req, res, next) => {
  const { userId } = req.params;

  const reposts = await userModel.findById(userId).populate({
    path: "repost",
    populate: {
      path: "postedBy",
      select: "username avatar",
    },
  });

  if (!reposts) {
    return next(new AppError("You haven't reposted yet", 404));
  }

  res.status(200).json({
    success: true,
    message: "Reposts fetched successfully",
    reposts: reposts.repost,
  });
});
