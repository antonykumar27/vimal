import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  useGetProductByIdQuery,
  useUpdateProductMutation,
  useDeleteProductMutation,
} from "../../store/api/ProductAdminApi";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaSave,
  FaTimes,
  FaUpload,
  FaImage,
  FaTag,
  FaBox,
  FaInfoCircle,
  FaArrowLeft,
  FaPlus,
} from "react-icons/fa";
import { motion } from "framer-motion";

function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetProductByIdQuery(id);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [productData, setProductData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    price: 0,
    salePrice: 0,
    totalStock: 0,
    media: [{ url: "", type: "image" }],
  });

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [isChanged, setIsChanged] = useState(false);

  // Initialize form with product data
  useEffect(() => {
    if (data?.product) {
      setProductData({
        title: data.product.title || "",
        description: data.product.description || "",
        category: data.product.category || "",
        brand: data.product.brand || "",
        price: data.product.price || 0,
        salePrice: data.product.salePrice || 0,
        totalStock: data.product.totalStock || 0,
        media: data.product.media?.length
          ? [...data.product.media]
          : [{ url: "", type: "image" }],
      });
    }
  }, [data]);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => {
      const newData = { ...prev, [name]: value };
      // Check if data has changed
      const changed = Object.keys(newData).some(
        (key) =>
          key !== "media" && newData[key] !== (data?.product?.[key] || "")
      );
      setIsChanged(changed);
      return newData;
    });
  };

  // Handle media changes
  const handleMediaChange = (index, value) => {
    setProductData((prev) => {
      const newMedia = [...prev.media];
      newMedia[index] = { ...newMedia[index], url: value };
      return { ...prev, media: newMedia };
    });
    setIsChanged(true);
  };

  // Add a new media field
  const addMediaField = () => {
    if (productData.media.length >= 7) {
      toast.warning("Maximum of 7 images allowed");
      return;
    }
    setProductData((prev) => ({
      ...prev,
      media: [...prev.media, { url: "", type: "image" }],
    }));
    setIsChanged(true);
  };

  // Remove a media field
  const removeMediaField = (index) => {
    setProductData((prev) => {
      const newMedia = [...prev.media];
      newMedia.splice(index, 1);
      return { ...prev, media: newMedia };
    });
    setIsChanged(true);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!productData.title.trim()) {
      newErrors.title = "Product title is required";
    }

    if (!productData.category.trim()) {
      newErrors.category = "Category is required";
    }

    if (productData.price <= 0) {
      newErrors.price = "Price must be greater than 0";
    }

    if (productData.salePrice < 0) {
      newErrors.salePrice = "Sale price cannot be negative";
    }

    if (productData.salePrice > productData.price) {
      newErrors.salePrice = "Sale price cannot be higher than regular price";
    }

    if (productData.totalStock < 0) {
      newErrors.totalStock = "Stock cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const res = await updateProduct({
        id,
        product: {
          ...productData,
          // Ensure numeric values
          price: Number(productData.price),
          salePrice: Number(productData.salePrice),
          totalStock: Number(productData.totalStock),
        },
      }).unwrap();
      toast.success(res.message || "Product updated successfully!");
      setIsChanged(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to update product");
    }
  };

  // Handle product deletion
  const handleDelete = async () => {
    try {
      const res = await deleteProduct(id).unwrap();
      toast.success(res.message || "Product deleted successfully!");
      navigate("/admin/products");
    } catch (err) {
      toast.error(err?.data?.message || "Delete failed");
      setShowDeleteModal(false);
    }
  };

  // Reset form to original data
  const handleReset = () => {
    if (data?.product) {
      setProductData({
        title: data.product.title || "",
        description: data.product.description || "",
        category: data.product.category || "",
        brand: data.product.brand || "",
        price: data.product.price || 0,
        salePrice: data.product.salePrice || 0,
        totalStock: data.product.totalStock || 0,
        media: data.product.media?.length
          ? [...data.product.media]
          : [{ url: "", type: "image" }],
      });
      setErrors({});
      setIsChanged(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-indigo-600"></div>
      </div>
    );
  }

  if (isError || !data?.product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto">
          <div className="text-6xl text-red-500 mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            The product you're trying to edit could not be found. It may have
            been removed or is temporarily unavailable.
          </p>
          <button
            onClick={() => navigate("/admin/products")}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full flex items-center gap-2 justify-center mx-auto hover:opacity-90 transition"
          >
            <FaArrowLeft /> Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <button
            onClick={() => navigate("/admin/products")}
            className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 mb-4"
          >
            <FaArrowLeft /> Back to Products
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product details and inventory</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleReset}
            disabled={!isChanged}
            className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
              isChanged
                ? "bg-gray-100 hover:bg-gray-200 text-gray-700"
                : "bg-gray-50 text-gray-400 cursor-not-allowed"
            } transition`}
          >
            <FaTimes /> Reset
          </button>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 flex items-center gap-2 transition"
          >
            <FaTrash /> Delete Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
          {/* Left Column - Product Images */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <FaImage className="text-indigo-500" /> Product Images
              </h2>
              <div className="text-sm text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                {productData.media.length}/7 images
              </div>
            </div>

            <div className="mb-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                {productData.media.map((media, index) => (
                  <div key={index} className="relative group">
                    <div className="bg-gray-50 border border-gray-200 rounded-xl w-full aspect-square flex items-center justify-center overflow-hidden">
                      {media.url ? (
                        <img
                          src={media.url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-gray-300 flex flex-col items-center">
                          <FaImage className="text-3xl mb-2" />
                          <span className="text-xs">No image</span>
                        </div>
                      )}
                    </div>
                    <button
                      onClick={() => removeMediaField(index)}
                      className="absolute top-2 right-2 bg-white text-red-500 rounded-full w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md hover:bg-red-50"
                    >
                      ×
                    </button>
                  </div>
                ))}

                {/* Add new image button */}
                {productData.media.length < 7 && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={addMediaField}
                    className="bg-gray-50 border-2 border-dashed border-indigo-300 rounded-xl w-full aspect-square flex flex-col items-center justify-center text-indigo-500 hover:bg-indigo-50 transition"
                  >
                    <FaPlus className="text-xl mb-2" />
                    <span className="text-sm font-medium">Add Image</span>
                  </motion.button>
                )}
              </div>

              <div className="text-sm text-gray-500 mb-4">
                <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-lg">
                  <p className="flex items-start gap-2">
                    <FaInfoCircle className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <span>
                      First image is the main product image. Maximum 7 images
                      allowed.
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Image URLs */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-700">Image URLs</h3>
              {productData.media.map((media, index) => (
                <div key={index} className="flex gap-2 items-center">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={media.url}
                      onChange={(e) => handleMediaChange(index, e.target.value)}
                      placeholder={`https://example.com/image-${index + 1}.jpg`}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
                      #{index + 1}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Product Details Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <FaInfoCircle className="text-indigo-500" /> Basic Information
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={productData.title}
                      onChange={handleChange}
                      className={`w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                        errors.title ? "border-red-500" : "border-gray-300"
                      }`}
                      placeholder="e.g. Premium Cotton T-Shirt"
                    />
                    {errors.title && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.title}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={productData.description}
                      onChange={handleChange}
                      rows="4"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                      placeholder="Describe your product..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <input
                        type="text"
                        name="category"
                        value={productData.category}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="e.g. Clothing"
                      />
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.category}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Brand
                      </label>
                      <input
                        type="text"
                        name="brand"
                        value={productData.brand}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                        placeholder="e.g. Nike"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Pricing & Inventory */}
              <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-gray-800">
                  <FaTag className="text-indigo-500" /> Pricing & Inventory
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Regular Price (₹) *
                      </label>
                      <input
                        type="number"
                        name="price"
                        value={productData.price}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                          errors.price ? "border-red-500" : "border-gray-300"
                        }`}
                        min="0"
                        step="0.01"
                      />
                      {errors.price && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.price}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Sale Price (₹)
                      </label>
                      <input
                        type="number"
                        name="salePrice"
                        value={productData.salePrice}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                          errors.salePrice
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        min="0"
                        step="0.01"
                      />
                      {errors.salePrice && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.salePrice}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-gray-500">
                        Set to 0 to disable sale price
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock Quantity *
                      </label>
                      <input
                        type="number"
                        name="totalStock"
                        value={productData.totalStock}
                        onChange={handleChange}
                        className={`w-full p-3 border rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 ${
                          errors.totalStock
                            ? "border-red-500"
                            : "border-gray-300"
                        }`}
                        min="0"
                      />
                      {errors.totalStock && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.totalStock}
                        </p>
                      )}
                    </div>

                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
                      <h3 className="font-medium text-indigo-800 mb-1">
                        Pricing Summary
                      </h3>
                      <div className="flex justify-between text-sm">
                        <span>Regular Price:</span>
                        <span className="font-medium">
                          ₹{productData?.price.toFixed(2)}
                        </span>
                      </div>
                      {productData.salePrice > 0 && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span>Sale Price:</span>
                            <span className="font-medium text-green-600">
                              ₹{productData?.salePrice.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm mt-1">
                            <span>You Save:</span>
                            <span className="font-medium">
                              ₹
                              {(
                                productData.price - productData.salePrice
                              ).toFixed(2)}
                              <span className="ml-2 text-red-600">
                                (
                                {Math.round(
                                  100 -
                                    (productData.salePrice /
                                      productData.price) *
                                      100
                                )}
                                % off)
                              </span>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-4">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isUpdating || !isChanged}
                  className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${
                    isUpdating || !isChanged
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90"
                  } shadow-md`}
                >
                  <FaSave />
                  {isUpdating ? "Saving..." : "Save Changes"}
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full"
          >
            <div className="text-center mb-6">
              <div className="mx-auto bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                <FaTrash className="text-red-600 text-2xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Delete Product
              </h2>
              <p className="text-gray-600">
                Are you sure you want to delete{" "}
                <span className="font-semibold">{productData.title}</span>? This
                action cannot be undone.
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-6 py-3 rounded-lg font-bold text-white bg-gradient-to-r from-red-500 to-red-600 hover:opacity-90 transition shadow-md"
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

export default ProductEdit;
