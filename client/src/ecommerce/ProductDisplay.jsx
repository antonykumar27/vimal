import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaHeart,
  FaSearch,
  FaStar,
  FaRegStar,
  FaFire,
  FaBolt,
  FaTag,
  FaChevronDown,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "../../store/api/ProductAdminApi";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function ProductDisplay() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { data, isLoading, isError } = useGetProductsQuery();
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortOption, setSortOption] = useState("featured");
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [wishlist, setWishlist] = useState([]);
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort products
  useEffect(() => {
    if (!data?.products) return;

    let result = [...data.products];

    // Apply search filter
    if (searchTerm) {
      result = result.filter(
        (product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply category filter
    if (activeCategory !== "all") {
      result = result.filter((product) => product.category === activeCategory);
    }

    // Apply sorting
    switch (sortOption) {
      case "price-low":
        result.sort((a, b) => a.salePrice - b.salePrice);
        break;
      case "price-high":
        result.sort((a, b) => b.salePrice - a.salePrice);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      default:
        // Featured - default sorting
        break;
    }

    setFilteredProducts(result);
  }, [data, searchTerm, activeCategory, sortOption]);
  const handleRedirect = (product) => {
    if (product.totalStock !== 0) {
      navigate(`/ecomerceloginHome/product/${product._id}`);
    }
  };
  // Get unique categories
  const categories = [
    "all",
    ...new Set(data?.products?.map((p) => p.category)),
  ];

  // Handle wishlist toggle
  const toggleWishlist = (id) => {
    setWishlist((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );

    toast.success(
      wishlist.includes(id) ? "Removed from wishlist" : "Added to wishlist",
      {
        position: "bottom-right",
        icon: wishlist.includes(id) ? "❌" : "❤️",
      }
    );
  };

  // Handle quick view
  const handleQuickView = (id) => {
    navigate(`/ecomerceloginHome/product/${id}`);
  };

  // Handle add to cart
  const handleAddToCart = (product) => {
    toast.success(
      <div>
        Added <span className="font-bold">{product.title}</span> to cart!
        <button
          className="ml-2 text-blue-600 underline"
          onClick={() => navigate("/cart")}
        >
          View Cart
        </button>
      </div>,
      {
        position: "bottom-right",
        autoClose: 3000,
        closeButton: false,
      }
    );
  };

  if (isError)
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-red-500 mb-4">
          Error loading products
        </h2>
        <button
          onClick={() => window.location.reload()}
          className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition shadow-lg hover:shadow-indigo-300"
        >
          Try Again
        </button>
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <motion.div
        className="bg-gradient-to-r from-purple-600 via-indigo-700 to-blue-800 rounded-3xl p-6 md:p-8 mb-12 text-white relative overflow-hidden shadow-xl"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-lg z-10 relative">
          <motion.h1
            className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            Summer Collection 2023
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-6 opacity-90"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            Discover our latest trends with up to 50% off
          </motion.p>
          <motion.button
            className="bg-white text-indigo-700 font-bold px-6 py-3 rounded-full flex items-center gap-2 hover:bg-gray-100 transition transform hover:-translate-y-0.5 shadow-lg"
            onClick={() =>
              document
                .getElementById("products-grid")
                .scrollIntoView({ behavior: "smooth" })
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaFire className="text-orange-500" />
            Shop Now
          </motion.button>
        </div>
        <div className="hidden md:block absolute -bottom-10 -right-10 w-72 h-72 bg-white bg-opacity-10 rounded-full"></div>
        <div className="hidden md:block absolute -top-20 -right-20 w-96 h-96 bg-white bg-opacity-5 rounded-full"></div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-8 right-8 w-16 h-16 rounded-full bg-white bg-opacity-20"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        />
        <motion.div
          className="absolute bottom-16 left-16 w-10 h-10 rounded-full bg-white bg-opacity-15"
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
      </motion.div>

      {/* Search and Filter Section */}
      <div className="mb-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6 mb-6">
          <div className="relative w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-4 pl-12 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm transition pr-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              {searchTerm && (
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Mobile filters toggle */}
            <button
              className="md:hidden w-full mt-4 flex items-center justify-between bg-indigo-600 text-white px-4 py-3 rounded-xl"
              onClick={() => setShowFilters(!showFilters)}
            >
              <span>Filters & Sorting</span>
              <FaChevronDown
                className={`transition-transform ${
                  showFilters ? "rotate-180" : ""
                }`}
              />
            </button>
          </div>

          <AnimatePresence>
            {(showFilters || window.innerWidth >= 768) && (
              <motion.div
                className={`flex flex-wrap gap-3 w-full md:w-auto mt-4 md:mt-0 ${
                  showFilters ? "pb-4 border-b border-gray-200 mb-4" : ""
                }`}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
              >
                <select
                  className="bg-white p-3 rounded-xl border border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 w-full md:w-auto"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Category Tabs */}
        <div className="flex overflow-x-auto pb-2 mb-6 hide-scrollbar">
          <div className="flex space-x-3 min-w-max">
            {categories.map((category) => (
              <motion.button
                key={category}
                className={`px-5 py-2.5 rounded-full flex items-center gap-2 transition whitespace-nowrap ${
                  activeCategory === category
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category === "trending" && (
                  <FaFire className="text-orange-500" />
                )}
                {category === "new" && <FaBolt className="text-yellow-500" />}
                {category === "sale" && <FaTag className="text-red-500" />}
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="mb-12" id="products-grid">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-3">
          {activeCategory === "trending" && (
            <FaFire className="text-orange-500" />
          )}
          {activeCategory === "new" && <FaBolt className="text-yellow-500" />}
          {activeCategory === "sale" && <FaTag className="text-red-500" />}
          {activeCategory === "all" ? "All Products" : activeCategory}
          <span className="text-gray-500 text-base font-normal ml-2">
            ({filteredProducts.length} products)
          </span>
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
              >
                <Skeleton height={220} />
                <div className="p-5">
                  <Skeleton count={2} />
                  <Skeleton width={100} />
                  <div className="flex justify-between mt-4">
                    <Skeleton width={80} />
                    <Skeleton circle width={40} height={40} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-5xl mb-4">😢</div>
            <h3 className="text-2xl font-bold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filter criteria
            </p>
            <motion.button
              className="bg-indigo-600 text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition shadow-lg"
              onClick={() => {
                setSearchTerm("");
                setActiveCategory("all");
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Reset Filters
            </motion.button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <AnimatePresence>
              {filteredProducts.map((product) => (
                <motion.div
                  key={product._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  whileHover={{
                    y: -10,
                    boxShadow:
                      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
                  }}
                  layout
                >
                  {/* Product Badges */}
                  <div className="absolute top-4 left-4 z-10 flex flex-col gap-1">
                    {product.totalStock <= 10 && product.totalStock > 0 && (
                      <span className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Only {product.totalStock} left!
                      </span>
                    )}
                    {product.totalStock === 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        Out of Stock
                      </span>
                    )}
                    {product.salePrice < product.price && (
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(
                          100 - (product.salePrice / product.price) * 100
                        )}
                        % OFF
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <motion.button
                    className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                    onClick={() => toggleWishlist(product._id)}
                    aria-label="Add to wishlist"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {wishlist.includes(product._id) ? (
                      <FaHeart className="text-red-500" />
                    ) : (
                      <FaHeart className="text-gray-400 hover:text-red-300" />
                    )}
                  </motion.button>

                  {/* Product Image */}
                  <div
                    className="relative h-60 overflow-hidden cursor-pointer group"
                    onClick={() => handleQuickView(product._id)}
                  >
                    {product.media?.[0]?.url ? (
                      <motion.img
                        src={product.media[0].url}
                        alt={product.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      />
                    ) : (
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}

                    {/* Quick View Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-black bg-opacity-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:bg-opacity-30 transition-all duration-300"
                      initial={{ opacity: 0 }}
                    >
                      <motion.button
                        className="bg-white text-indigo-600 font-bold px-6 py-3 rounded-full hover:bg-indigo-50 transition transform hover:-translate-y-1"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickView(product._id);
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Quick View
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Product Info */}
                  <div className="p-5">
                    <div
                      className="text-gray-500 text-sm mb-1 cursor-pointer hover:text-indigo-600 transition"
                      onClick={() => setActiveCategory(product.category)}
                    >
                      {product.category}
                    </div>
                    <h3
                      className="font-bold text-lg mb-2 cursor-pointer hover:text-indigo-600 transition truncate"
                      onClick={() => handleQuickView(product._id)}
                    >
                      {product.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2 min-h-[2.5rem]">
                      {product.description}
                    </p>

                    {/* Rating */}
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-yellow-500">
                          {i < Math.floor(product.rating || 0) ? (
                            <FaStar />
                          ) : (
                            <FaRegStar />
                          )}
                        </span>
                      ))}
                      <span className="text-gray-500 text-sm ml-2">
                        ({product.reviewCount || 0})
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <div>
                        {product.salePrice < product.price ? (
                          <>
                            <span className="text-xl font-bold text-gray-900">
                              ₹{product.salePrice.toLocaleString()}
                            </span>
                            <span className="text-gray-500 line-through ml-2 text-sm">
                              ₹{product.price.toLocaleString()}
                            </span>
                          </>
                        ) : (
                          <span className="text-xl font-bold text-gray-900">
                            ₹{product.price.toLocaleString()}
                          </span>
                        )}
                      </div>

                      <motion.button
                        className={`p-3 rounded-full ${
                          product.totalStock === 0
                            ? "bg-gray-300 cursor-not-allowed"
                            : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        } text-white transition shadow-md`}
                        disabled={product.totalStock === 0}
                        onClick={() => handleRedirect(product)} // ✅ Pass product here
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <FaShoppingCart />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Load More Button */}
      {!isLoading && filteredProducts.length > 0 && (
        <div className="text-center">
          <motion.button
            className="bg-white text-indigo-600 border border-indigo-600 px-8 py-3 rounded-full hover:bg-indigo-50 transition shadow hover:shadow-md"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Load More Products
          </motion.button>
        </div>
      )}

      <style jsx>{`
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default ProductDisplay;
