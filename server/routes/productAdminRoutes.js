const express = require("express");

const {
  createProductAdmin,
  getProductsAdmin,
  getProductById,
  updateProductAdmin,
  updateProductReview,
} = require("../controller/productAdminController");

const { isAuthenticatedUser } = require("../middlewares/authenticate");
const { multerMiddleware } = require("../config/cloudinary");

const router = express.Router();

router.post(
  "/products",
  isAuthenticatedUser,
  multerMiddleware,
  createProductAdmin
);
router.get(
  "/products",
  isAuthenticatedUser,
  multerMiddleware,
  getProductsAdmin
);
router.get(
  "/products/:id",
  isAuthenticatedUser,
  multerMiddleware,
  getProductById
);
router.put(
  "/products/:id",
  isAuthenticatedUser,
  multerMiddleware,
  updateProductAdmin
);

router.post(
  "/reviews",
  isAuthenticatedUser,
  multerMiddleware,
  updateProductReview
);
module.exports = router;
