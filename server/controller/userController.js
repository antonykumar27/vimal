const catchAsyncError = require("../middlewares/catchAsyncError");
const User = require("../models/userModel");
const fs = require("fs");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwt");

const bcrypt = require("bcryptjs");
const cloudinary = require("cloudinary").v2;
const { uploadFileToCloudinary } = require("../config/cloudinary");

//Register User - /api/v1/register
// exports.registerUser = catchAsyncError(async (req, res, next) => {
//   const { name, email, password } = req.body;
//   const file = req.file;

//   // Check for existing user
//   const existingUser = await User.findOne({ email });
//   if (existingUser) {
//     return next(new ErrorHandler("User already exists with this email", 400));
//   }

//   let mediaUrl = null;
//   let mediaType = null;

//   // Upload media if exists
//   if (file) {
//     const uploadResult = await uploadFileToCloudinary(file);
//     mediaUrl = uploadResult?.secure_url;
//     mediaType = file.mimetype.startsWith("video") ? "video" : "image";
//   }

//   // Create user
//   const user = await User.create({
//     name,
//     email,

//     password,

//     media: mediaUrl,
//   });

//   sendToken(user, 201, res);
// });

exports.registerUser = catchAsyncError(async (req, res, next) => {
  const { name, email, password, secretKey } = req.body;
  const file = req.file;

  // Check for existing user
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  let mediaUrl = null;
  let mediaType = null;

  // Upload media if exists
  if (file) {
    const uploadResult = await uploadFileToCloudinary(file);
    mediaUrl = uploadResult?.secure_url;
    mediaType = file.mimetype.startsWith("video") ? "video" : "image";
  }

  // Check secret key for admin role
  const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "mysecretkey"; // you can move this to .env
  let role = "user"; // default role

  if (secretKey) {
    if (secretKey === ADMIN_SECRET) {
      role = "admin";
    } else {
      return next(new ErrorHandler("Invalid admin secret key", 401));
    }
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    media: mediaUrl,
    role, // set user role
  });

  sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  // Find user by email
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // Compare passwords
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  // If valid, send token
  sendToken(user, 200, res);
});
