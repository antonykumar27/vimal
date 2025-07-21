const jwt = require("jsonwebtoken");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncError = require("../middlewares/catchAsyncError");
const Admin = require("../models/school/schoolAdminSchema");

// 🔹 Middleware to Check Authentication
exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {
  let token;

  // 1️⃣ Check if the token is sent in the Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }
  // 2️⃣ If not, check if it's stored in cookies
  else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // 3️⃣ If no token, return an error
  if (!token) {
    return next(new ErrorHandler("Please log in to access this resource", 401));
  }

  // 4️⃣ Verify the token
  try {
    const decodedData = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await Admin.findById(decodedData.id);

    if (!req.user) {
      return next(new ErrorHandler("User not found", 404));
    }

    next();
  } catch (error) {
    return next(new ErrorHandler("Invalid or expired token", 401));
  }
});

// 🔹 Middleware for Role-Based Access
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorHandler(`Role (${req.user.role}) is not authorized`, 403)
      );
    }
    next();
  };
};
