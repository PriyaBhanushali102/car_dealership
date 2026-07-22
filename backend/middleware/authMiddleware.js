import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { JWT_SECRET } from "../config/env.config.js";

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    throw new AppError("Access denied. No token provided.", 401);
  }

  // Verify JWT
  const decoded = jwt.verify(token, JWT_SECRET);

  // Find user using userId from token
  const user = await User.findById(decoded.userId).select("-password");

  if (!user) {
    throw new AppError("User not found", 401);
  }

  req.user = user;

  next();
});
