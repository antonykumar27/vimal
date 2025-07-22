const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter product name"],
    trim: true,
    maxLength: [300, "Product name cannot exceed 100 characters"],
  },
  category: { type: String },
  price: {
    type: Number,
    required: true,
    default: 0.0,
  },
  brand: { type: String },
  salePrice: { type: Number },
  description: {
    type: String,
    required: [true, "Please enter product description"],
  },
  ratings: {
    type: Number,
    default: 0,
  },
  media: [
    {
      url: { type: String, required: true },
      type: {
        type: String,
        enum: ["image", "video", "pdf"],
        required: true,
      },
      pdfUrl: { type: String, default: null },
    },
  ],

  totalStock: {
    type: Number,
    default: 0,
  },
  sold: {
    type: Number,
    default: 0, // total sold
  },
  numOfReviews: {
    type: Number,
    default: 0,
  },
  averageReview: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      rating: {
        type: Number,
        required: false,
      },
      comment: {
        type: String,
        required: false,
      },
    },
  ],
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
