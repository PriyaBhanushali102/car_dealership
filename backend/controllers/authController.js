import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

export const registerUser = asyncHandler(async (req, res) => {
  res.status(201).json({
    message: "User Registered",
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "Login Success",
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    message: "My Profile",
  });
});
