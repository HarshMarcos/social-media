import AppError from "../util/error.js";
import asyncHandler from "../middleware/asyncHandler.js";
import JWT from "jsonwebtoken";
import userModel from "../model/user.js";

const isLoggedIn = asyncHandler(async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return next(new AppError("Unauthenticated, please login again", 401));
  }

  const decodeToken = await JWT.verify(token, process.env.JWT_SECRET);
  req.user = decodeToken;

  next();
});

const authorizedRoles = (...roles) =>
  asyncHandler(async (req, res, next) => {
    const { id } = req.user;

    const acessUser = await userModel.findById(id);

    if (!roles.includes(acessUser.role)) {
      return next(
        new AppError("You don't have permission to acess this route.", 403)
      );
    }

    next();
  });

export { isLoggedIn, authorizedRoles };
