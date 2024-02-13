import userModel from "../model/user.js";
import generateDefaultAvatar from "../util/avatar.js";
import fs from "fs/promises";
import cloudinary from "cloudinary";
import AppError from "../util/error.js";
import asyncHandler from "../middleware/asyncHandler.js";

const cookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000, // Valid for 7 days
  httpOnly: true,
  sameSite: process.env.NODE_ENV === "Development" ? "lax" : "none",
  secure: process.env.NODE_ENV === "Development" ? "false" : "true",
};

const register = asyncHandler(async (req, res, next) => {
  const { fullname, username, email, password } = req.body;

  if (!fullname || !username || !email || !password) {
    return next(new AppError("All fields are mandatory", 400));
  }

  // check username exists already
  const usernameExists = await userModel.findOne({ username });

  if (usernameExists) {
    return next(new AppError("Username already exists", 400));
  }

  // check email exists already
  const emailExists = await userModel.findOne({ email });

  if (emailExists) {
    return next(new AppError("Email already exists", 400));
  }

  // Create new user
  const user = await userModel.create({
    fullname,
    username,
    email,
    password,
    avatar: {
      public_id: "dummy",
      secure_url: "http://dummy.com",
    },
  });

  // Generate default avatar
  const defaultAvatar = await generateDefaultAvatar(username);

  // Create temporary file from the buffer
  const tempFilePath = path.join(process.cwd(), "temp_avatar.png");

  await fs.writeFile(tempFilePath, defaultAvatar);

  // Upload default avatar to the cloudinary
  try {
    const result = await cloudinary.v2.uploader.upload(tempFilePath, {
      folder: "SpeakWave_Users",
      width: 250,
      height: 250,
      gravity: "faces",
      crop: "fill",
    });

    if (result) {
      user.avatar.public_id = result.public_id;
      user.avatar.secure_url = result.secure_url;

      await user.save();
    }
  } catch (err) {
    return next(
      new AppError("File uploading failed, please try again later.", 500)
    );
  } finally {
    // Delete temporary file path
    fs.unlink(tempFilePath);
  }

  user.password = undefined;

  // Generating jwt token
  const token = await user.generateToken();

  res.cookie("token", token, cookieOptions);

  res.status(201).json({
    success: true,
    message: "Registered successfully!",
    user,
  });
});

const login = asyncHandler(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError("All filelds are mandatory", 400));
  }

  const userExists = await userModel.findOne({ username }).select("+password");

  if (!userExists) {
    return next(new AppError("Username does not exist", 400));
  }

  const comparePassword = await userExists.comparePassword(password);

  if (!comparePassword) {
    return next(
      new AppError("Password doesnt match, please enter correct password", 400)
    );
  }

  userExists.password = undefined;

  const token = await userExists.generateToken();

  res.cookies("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Loggedin Successfully",
    user: userExists,
  });
});

export { register, login };
