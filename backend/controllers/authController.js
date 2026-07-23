import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";
import { JWT_SECRET, JWT_EXPIRATION } from "../config/env.config.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  //check if user already exsist
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("User with this email already exists.", 400);
  }

  //create user
  const newUser = await User.create({
    name,
    email,
    password,
  });

  //generate jwt token
  const token = jwt.sign(
    { userId: newUser._id, role: newUser.role },
    JWT_SECRET,
    {
      expiresIn: JWT_EXPIRATION,
    },
  );

  //store token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  //remove password from response
  const userResponse = newUser.toObject();
  delete userResponse.password;
  res.status(201).json({
    success: true,
    token,
    data: userResponse,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //find user
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError("User not found.", 404);
  }

  // Compare password using model method
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    throw new AppError("Invalid email or password", 401);
  }

  //generate jwt token
  const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });

  // Set token in cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "strict" : "none",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  //remove password from response
  const userResponse = user.toObject();
  delete userResponse.password;

  res.status(200).json({
    success: true,
    token,
    data: userResponse,
  });
});

// Get current authenticated user
export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user,
  });
});
