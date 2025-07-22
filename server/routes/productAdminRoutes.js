const express = require("express");

const {
  createProductAdmin,
  getProductsAdmin,
  getProductById,
  updateProductAdmin,
  updateProductReview,
  addToCart,
  getCart,
  deleteCartItem,
  updateCartItem,
  createOrder,
  processPayment,
  sendStripeApi,
  getMyOrders,
  getDashboardStats,
  getAllOrdersForAdmin,
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
router.post("/cart", isAuthenticatedUser, multerMiddleware, addToCart);
router.delete(
  "/products/remove/:id",
  isAuthenticatedUser,
  multerMiddleware,
  deleteCartItem
);

router.get("/cart", isAuthenticatedUser, multerMiddleware, getCart);
router.put(
  "/cart/update/:id",
  isAuthenticatedUser,
  multerMiddleware,
  updateCartItem
);
router.route("/payment/process").post(isAuthenticatedUser, processPayment);
router.route("/stripeapi").get(isAuthenticatedUser, sendStripeApi);
router.post("/orders", isAuthenticatedUser, multerMiddleware, createOrder);
router.get(
  "/productsorder",
  isAuthenticatedUser,
  multerMiddleware,
  getMyOrders
);
router.get(
  "/adminfullDetailss",
  isAuthenticatedUser,
  multerMiddleware,
  getDashboardStats
);
router.get(
  "/productsallorder",
  isAuthenticatedUser,
  multerMiddleware,
  getAllOrdersForAdmin
);
module.exports = router;
