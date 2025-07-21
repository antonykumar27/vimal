import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
} from "../../store/api/ProductAdminApi";
import { toast } from "react-toastify";
import {
  FaShoppingCart,
  FaHeart,
  FaStar,
  FaRegStar,
  FaTrash,
  FaEdit,
  FaChevronLeft,
  FaShare,
  FaTruck,
  FaShieldAlt,
  FaUndo,
} from "react-icons/fa";

import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import StarRating from "@/ecommerce/StarRating";
import StarRatingCreate from "@/ecommerce/SratRatingCreate";
function SingleProductUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError, refetch } = useGetProductByIdQuery(id);
  const [deleteProduct] = useDeleteProductMutation();

  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const product = data?.product;

  const handleDelete = async () => {
    try {
      const res = await deleteProduct(id).unwrap();
      toast.success(res.message || "Product deleted successfully");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      setShowDeleteConfirmation(false);
    }
  };

  const handleAddToCart = () => {
    toast.success(`${quantity} ${product.title} added to cart!`);
    // In a real app, you would dispatch to cart store here
  };

  const incrementQuantity = () => {
    if (quantity < product.totalStock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="bg-white rounded-xl shadow-md p-6">
            <Skeleton height={400} />
            <div className="grid grid-cols-4 gap-4 mt-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} height={80} />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton height={40} width={300} />
            <Skeleton height={30} width={200} />
            <div className="flex items-center gap-2">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} circle width={24} height={24} />
              ))}
            </div>
            <Skeleton height={20} width={150} />
            <Skeleton height={100} count={3} />
            <div className="flex gap-4">
              <Skeleton height={50} width={150} />
              <Skeleton height={50} width={150} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl mx-auto">
          <div className="text-6xl mb-4">😢</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't find the product you're looking for. It may have been
            removed or is temporarily unavailable.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="bg-indigo-600 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-700 transition"
            >
              <FaChevronLeft /> Continue Shopping
            </button>
            <button
              onClick={refetch}
              className="bg-white text-indigo-600 border border-indigo-600 px-6 py-3 rounded-full flex items-center gap-2 hover:bg-indigo-50 transition"
            >
              <FaUndo /> Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <button
          onClick={() => navigate("/")}
          className="hover:text-indigo-600 transition"
        >
          Home
        </button>
        <span className="mx-2">/</span>
        <button
          onClick={() => navigate(`/category/${product.category}`)}
          className="hover:text-indigo-600 transition capitalize"
        >
          {product.category}
        </button>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {product.title}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div>
          {/* Main Image */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-4">
            {product.media?.[selectedImage]?.url ? (
              <img
                src={product.media[selectedImage].url}
                alt={product.title}
                className="w-full h-[500px] object-contain p-4"
              />
            ) : (
              <div className="bg-gray-100 border-2 border-dashed rounded-xl w-full h-[500px] flex items-center justify-center text-gray-500">
                No Image Available
              </div>
            )}
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {product.media?.map((media, index) => (
              <button
                key={index}
                className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? "border-indigo-600 scale-105"
                    : "border-transparent hover:border-gray-300"
                }`}
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={media.url}
                  alt={`${product.title} - ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div>
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
              <h1 className="text-3xl font-bold text-gray-900">
                {product.title}
              </h1>

              <div className="flex gap-3">
                <button
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  onClick={() => setIsWishlisted(!isWishlisted)}
                  aria-label={
                    isWishlisted ? "Remove from wishlist" : "Add to wishlist"
                  }
                >
                  <FaHeart
                    className={isWishlisted ? "text-red-500" : "text-gray-500"}
                  />
                </button>
                <button
                  className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition"
                  aria-label="Share product"
                >
                  <FaShare className="text-gray-500" />
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
              {/* Rating and Review */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                <StarRatingCreate productId={id} product={product} />
                <span className="text-gray-600 text-sm">
                  ({product.reviewCount || 0} reviews)
                </span>
              </div>

              {/* Stock Info */}
              <div className="flex">
                <StarRating
                  rating={product.averageReview / product.numOfReviews || 0}
                />
                {product.totalStock > 0 ? (
                  <span className="text-green-600 font-medium flex items-center gap-1 text-sm">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-red-600 font-medium flex items-center gap-1 text-sm">
                    <div className="w-2 h-2 bg-red-600 rounded-full" />
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ₹{product.salePrice.toLocaleString()}
                </span>
                {product.salePrice < product.price && (
                  <span className="text-xl text-gray-500 line-through">
                    ₹{product.price.toLocaleString()}
                  </span>
                )}
                {product.salePrice < product.price && (
                  <span className="bg-red-100 text-red-700 font-bold px-3 py-1 rounded">
                    Save ₹{(product.price - product.salePrice).toLocaleString()}
                  </span>
                )}
              </div>

              <p className="text-gray-700 mb-8">
                {product.description || "No description available."}
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Brand</h3>
                  <p className="text-gray-700">
                    {product.brand || "No brand specified"}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Category</h3>
                  <p className="text-gray-700 capitalize">{product.category}</p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">SKU</h3>
                  <p className="text-gray-700">
                    {product._id.slice(-8).toUpperCase()}
                  </p>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 mb-2">Availability</h3>
                  <p className="text-gray-700">
                    {product.totalStock} units in stock
                  </p>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-8">
                <h3 className="font-bold text-gray-900 mb-3">Quantity</h3>
                <div className="flex items-center">
                  <button
                    onClick={decrementQuantity}
                    disabled={quantity <= 1}
                    className={`p-3 border border-gray-300 rounded-l-lg ${
                      quantity <= 1
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    -
                  </button>
                  <div className="w-16 text-center p-3 border-t border-b border-gray-300">
                    {quantity}
                  </div>
                  <button
                    onClick={incrementQuantity}
                    disabled={quantity >= product.totalStock}
                    className={`p-3 border border-gray-300 rounded-r-lg ${
                      quantity >= product.totalStock
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    +
                  </button>
                  <span className="ml-4 text-gray-600">
                    Max: {product.totalStock} units
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  disabled={product.totalStock === 0}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-lg font-bold text-white shadow-lg transition ${
                    product.totalStock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  }`}
                >
                  <FaShoppingCart /> Add to Cart
                </motion.button>

                <button
                  onClick={() =>
                    navigate(`/ecomerceloginHome/productupdate/${product._id}`)
                  }
                  className="flex items-center gap-2 py-4 px-6 rounded-lg font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition"
                >
                  <FaEdit /> Edit Product
                </button>
              </div>
            </div>
          </div>

          {/* Shipping & Support */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
              <div className="bg-indigo-100 p-3 rounded-full">
                <FaTruck className="text-indigo-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Free Shipping</h3>
                <p className="text-gray-600 text-sm">On orders over ₹5,000</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
              <div className="bg-green-100 p-3 rounded-full">
                <FaUndo className="text-green-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Easy Returns</h3>
                <p className="text-gray-600 text-sm">30-day return policy</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <FaShieldAlt className="text-blue-600 text-xl" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">Secure Payment</h3>
                <p className="text-gray-600 text-sm">
                  100% secure transactions
                </p>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => setShowDeleteConfirmation(true)}
              className="flex items-center gap-2 py-3 px-6 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition"
            >
              <FaTrash /> Delete Product
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.title}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirmation(false)}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-lg font-bold text-white bg-red-500 hover:bg-red-600 transition"
              >
                Delete Product
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export default SingleProductUpdate;
