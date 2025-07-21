//add a new product
const Product = require("../models/productAdminModel");
const { uploadFileToCloudinary } = require("../config/cloudinary");
const fs = require("fs");

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
