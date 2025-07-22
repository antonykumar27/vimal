//add a new product
const Product = require("../models/productAdminModel");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema.js");
const { uploadFileToCloudinary } = require("../config/cloudinary");
const dotenv = require("dotenv");
const fs = require("fs");
const { io, getReceiverSocketId } = require("../server.js");
const catchAsyncError = require("../middlewares/catchAsyncError");
const stripe = require("stripe")(process.env.SECRET_STRIPE_KEY);
const path = require("path");

dotenv.config({ path: path.join(__dirname, "config/config.env") });
exports.createProductAdmin = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    // Handle new media upload
    const mediaFiles = req.files?.media || [];
    const mediaUrls = [];
    for (const file of mediaFiles) {
      const uploaded = await uploadFileToCloudinary(file);
      if (uploaded?.url) mediaUrls.push(uploaded);

      // Clean up temp file after upload
      fs.unlink(file.path, () => {});
    }
    const newProduct = await Product.create({
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
      media: mediaUrls,
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    console.error("Create product error:", err);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};
exports.getProductsAdmin = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      message: "Products fetched successfully",
      products,
    });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const productId = req.params.id;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product fetched successfully",
      product,
    });
  } catch (err) {
    console.error("Get product by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};
exports.updateProductAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
      averageReview,
    } = req.body;

    const mediaFiles = req.files?.media || [];
    const mediaUrls = [];

    for (const file of mediaFiles) {
      const uploaded = await uploadFileToCloudinary(file);
      if (uploaded?.url) mediaUrls.push(uploaded);
      fs.unlink(file.path, () => {});
    }

    const product = await Product.findById(id);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Update fields
    product.title = title;
    product.description = description;
    product.category = category;
    product.brand = brand;
    product.price = price;
    product.salePrice = salePrice;
    product.totalStock = totalStock;
    product.averageReview = averageReview;

    // Append new media if uploaded
    if (mediaUrls.length > 0) {
      product.media.push(...mediaUrls);
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (err) {
    console.error("Update product error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

exports.updateProductReview = async (req, res) => {
  try {
    const { rating, comment, productId } = req.body;
    const userId = req.user._id; // You must have auth middleware

    if (!rating || typeof rating !== "number") {
      return res.status(400).json({
        success: false,
        message: "Rating is required and must be a number",
      });
    }

    const product = await Product.findById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // Check if user already reviewed
    const existingReviewIndex = product.reviews.findIndex(
      (r) => r.user.toString() === userId.toString()
    );

    if (existingReviewIndex !== -1) {
      // Update existing review
      product.reviews[existingReviewIndex].rating = rating;
      product.reviews[existingReviewIndex].comment = comment;
    } else {
      // Add new review
      product.reviews.push({ user: userId, rating, comment });
    }

    // Update averageReview and numOfReviews
    const totalRatings = product.reviews.length;
    const averageRating =
      product.reviews.reduce((acc, r) => acc + r.rating, 0) / totalRatings;

    product.averageReview = Number(averageRating.toFixed(1));
    product.numOfReviews = totalRatings;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Review submitted successfully",
      averageReview: product.averageReview,
      numOfReviews: product.numOfReviews,
      reviews: product.reviews,
    });
  } catch (err) {
    console.error("Review update error:", err);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

// Add or update cart item
exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity) {
    return res
      .status(400)
      .json({ message: "Product ID and quantity required" });
  }

  try {
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [{ productId, quantity }],
      });
    } else {
      const existingItem = cart.items.find(
        (item) => item.productId.toString() === productId
      );

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }

      cart.updatedAt = Date.now();
    }

    await cart.save();

    // 🔴 Emit socket event to frontend after cart update
    const socketId = getReceiverSocketId(userId); // map userId to socketId

    if (socketId) {
      io.to(socketId).emit("cartUpdated", {
        cart,
        message: "Cart updated successfully!",
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Add to cart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const cart = await Cart.findOne({ user: userId }).populate({
      path: "items.productId",
      select: "title price salePrice media", // return only useful fields
    });

    if (!cart) {
      return res.status(200).json({ success: true, cart: { items: [] } });
    }

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Get cart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
exports.deleteCartItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // this is the item's ID to delete

  if (!id) {
    return res.status(400).json({ message: "Product ID is required" });
  }

  try {
    // 1. Find the cart for the logged-in user
    const cart = await Cart.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 2. Remove the item by filtering it out
    cart.items = cart.items.filter((item) => item.id.toString() !== id);

    await cart.save();

    // 3. Emit cart update via Socket.IO
    const socketId = getReceiverSocketId(userId);
    if (socketId) {
      io.to(socketId).emit("cartdeleted", {
        cart,
        message: "Item removed from cart",
      });
    }

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Delete cart item error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params; // this is productId
  const { quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: "Quantity must be at least 1" });
  }

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // ✅ Fix: search by productId instead of item._id
    const item = cart.items.find((i) => i.productId.toString() === id);
    if (!item) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    item.quantity = quantity;
    cart.updatedAt = Date.now();
    await cart.save();

    return res.status(200).json({ success: true, cart });
  } catch (err) {
    console.error("Update cart error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

exports.processPayment = catchAsyncError(async (req, res, next) => {
  const { amount, shipping } = req.body;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert rupees to paisa
    currency: "inr", // use "usd" if you're using USD
    description: "Order Payment",
    metadata: { integration_check: "accept_payment" },
    shipping, // Optional: only if you want to show shipping info on Stripe Dashboard
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

exports.sendStripeApi = catchAsyncError(async (req, res, next) => {
  res.status(200).json({
    stripeApiKey: process.env.PUBLISH_STRIPE_KEY,
  });
});
// exports.createOrder = async (req, res, next) => {
//   const {
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     paymentMode,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//   } = req.body;

//   const order = await Order.create({
//     user: req.user._id, // Make sure user is authenticated and req.user exists
//     shippingInfo,
//     orderItems,
//     paymentInfo,
//     paymentMode,
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     paidAt: paymentMode === "Online" ? Date.now() : null,
//   });

//   res.status(201).json({
//     success: true,
//     order,
//   });
// };

exports.createOrder = catchAsyncError(async (req, res, next) => {
  const {
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMode,
    paymentInfo,
  } = req.body;

  const user = req.user._id;

  // Validate orderItems before proceeding
  for (const item of orderItems) {
    const { productId, quantity } = item;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product not found: ${productId}`,
      });
    }

    if (product.totalStock < quantity) {
      return res.status(400).json({
        success: false,
        message: `Insufficient stock for ${product.title}. Available: ${product.totalStock}, Requested: ${quantity}`,
      });
    }
  }

  // ✅ Create the Order
  const order = await Order.create({
    orderItems,
    shippingInfo,
    itemsPrice,
    taxPrice,
    shippingPrice,
    totalPrice,
    paymentMode,
    paymentInfo,
    user,
    paidAt: paymentMode === "Online" ? Date.now() : null,
  });

  // ✅ Decrease Product Stock
  for (const item of orderItems) {
    const { productId, quantity } = item;

    await Product.findByIdAndUpdate(
      productId,
      { $inc: { totalStock: -quantity } },
      { new: true }
    );
  }

  // ✅ Clean up user's cart
  const cart = await Cart.findOne({ user });

  if (cart) {
    const remainingItems = cart.items.filter((cartItem) => {
      return !orderItems.some((orderItem) => {
        const orderedId =
          orderItem.productId?.toString() || orderItem.product?.toString();
        return cartItem.productId?.toString() === orderedId;
      });
    });

    cart.items = remainingItems;
    await cart.save();
  }

  res.status(201).json({
    success: true,
    message: "Order placed successfully!",
    order,
  });
});
exports.getMyOrders = catchAsyncError(async (req, res, next) => {
  const userId = req.user._id;

  const orders = await Order.find({ user: userId })
    .populate("orderItems.productId", "title price media")
    .sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    orders,
  });
});
