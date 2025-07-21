const express = require("express");
const { registerUser, loginUser } = require("../controller/userController");
const { multerMiddleware } = require("../config/cloudinary2");
const { isAuthenticatedUser } = require("../middlewares/authenticate");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
module.exports = router;
