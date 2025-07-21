import React, { useState, useRef, useEffect } from "react";
import { FiUpload, FiX, FiPlus, FiChevronDown } from "react-icons/fi";
import {
  useGetProductByIdQuery,
  useDeleteProductMutation,
  useCreateProductMutation,
} from "../../store/api/ProductAdminApi";
import { cn } from "@/lib/utils";
import { useNavigate, useParams } from "react-router-dom";
import {
  UploadCloud as CloudUploadIcon,
  Send as PaperAirplaneIcon,
  FileText as DocumentTextIcon,
  Calendar as CalendarIcon,
  Clock as ClockIcon,
  X as XIcon,
  TrendingUp as TrendingIcon,
} from "lucide-react";
import { useTheme } from "next-themes";
// Mock data for dropdowns (replace with API data)
const categories = [
  "Banarasi Silk",
  "Kanjivaram",
  "Chanderi",
  "Maheshwari",
  "Tussar Silk",
  "Patola",
  "Bandhani",
  "Kota Doria",
];

const brands = [
  "Suta",
  "Raw Mango",
  "Nalli Silks",
  "Kanchipuram Silks",
  "Biba",
  "FabIndia",
  "Anokhi",
  "Global Desi",
];

const initialState = {
  image: [],
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  totalStock: "",
  colors: ["#ef4444", "#3b82f6"], // Default colors
  fabric: "",
  occasion: "",
  length: "",
  blouseIncluded: false,
};

const ProductCreateModal = () => {
  const { id } = useParams();
  console.log("id", id);
  const [formData, setFormData] = useState(initialState);
  const [createProduct, { isLoading, isSuccess, error }] =
    useCreateProductMutation();
  const { data } = useGetProductByIdQuery(id);
  console.log("getProduct", data);
  const [imagePreview, setImagePreview] = useState(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showBrandDropdown, setShowBrandDropdown] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [newBrand, setNewBrand] = useState("");
  const fileInputRef = useRef(null);
  const modalRef = useRef(null);
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [previewFiles, setPreviewFiles] = useState([]);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "file") {
      const file = e.target.files[0];
      if (file) {
        setFormData({ ...formData, [name]: file });
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else if (type === "checkbox") {
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };
  const removeFile = (index) => {
    setPreviewFiles((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      image: prev.image.filter((_, i) => i !== index),
    }));
  };
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(
      (file) => file.size <= 10 * 1024 * 1024
    );

    if (files.length === 0) {
      toast.warning("Files must be under 10MB");
      return;
    }

    const newPreviews = files.map((file) => ({
      type: file.type.startsWith("image/") ? "image" : "pdf",
      file,
      url: URL.createObjectURL(file),
      name: file.name,
    }));

    setPreviewFiles((prev) => [...prev, ...newPreviews]);
    setFormData((prev) => ({ ...prev, image: [...prev.image, ...files] }));
  };
  const closeModal = () => {
    navigate(-1); // Goes back to previous page, like closing a modal
  };
  useEffect(() => {
    if (data?.product) {
      const product = data.product;

      setFormData({
        image: product.media?.[0] || null,
        title: product.title || "",
        description: product.description || "",
        category: product.category || "",
        brand: product.brand || "",
        price: product.price || "",
        salePrice: product.salePrice || "",
        totalStock: product.totalStock || "",
        colors: product.colors || ["#ef4444", "#3b82f6"],
        fabric: product.fabric || "",
        occasion: product.occasion || "",
        length: product.length || "",
        blouseIncluded: product.blouseIncluded || false,
      });
    }
  }, [data]);

  const handleColorChange = (index, color) => {
    const newColors = [...formData.colors];
    newColors[index] = color;
    setFormData({ ...formData, colors: newColors });
  };

  const addColor = () => {
    if (formData.colors.length < 6) {
      setFormData({
        ...formData,
        colors: [...formData.colors, "#000000"],
      });
    }
  };

  const removeColor = (index) => {
    if (formData.colors.length > 1) {
      const newColors = formData.colors.filter((_, i) => i !== index);
      setFormData({ ...formData, colors: newColors });
    }
  };

  const handleCategorySelect = (category) => {
    setFormData({ ...formData, category });
    setShowCategoryDropdown(false);
  };

  const handleBrandSelect = (brand) => {
    setFormData({ ...formData, brand });
    setShowBrandDropdown(false);
  };

  const addNewCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      categories.push(newCategory);
      setFormData({ ...formData, category: newCategory });
      setNewCategory("");
    }
    setShowCategoryDropdown(false);
  };

  const addNewBrand = () => {
    if (newBrand.trim() && !brands.includes(newBrand)) {
      brands.push(newBrand);
      setFormData({ ...formData, brand: newBrand });
      setNewBrand("");
    }
    setShowBrandDropdown(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();

    // Append form fields
    for (const key in formData) {
      if (key === "colors") {
        formData.colors.forEach((color, index) => {
          data.append(`colors[${index}]`, color);
        });
      } else if (key !== "image") {
        data.append(key, formData[key]);
      }
    }

    // Append the image file as "media"
    // Append files
    for (const item of formData.image) {
      if (item instanceof File) {
        // New uploaded file
        data.append("media", item);
      } else if (item?.url) {
        // Convert old Cloudinary file into a Blob and append as file
        const response = await fetch(item.url);
        const blob = await response.blob();
        const filename = item.url.split("/").pop(); // Extract filename from URL
        const fileType = blob.type || "application/octet-stream";

        const fileFromUrl = new File([blob], filename, { type: fileType });
        data.append("media", fileFromUrl);
      }
    }
    try {
      await createProduct(data).unwrap();
      setFormData(initialState);
      setImagePreview(null);
      onClose();
    } catch (err) {
      console.error("Failed to create product:", err);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };
  const handleBackdropClick = (e) => {
    // Only close if clicked directly on the backdrop (not inside modal)
    if (e.target.id === "modal-backdrop") {
      closeModal();
    }
  };
  return (
    <div className="  z-50 flex items-center justify-center p-4">
      <div
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl w-full max-w-4xl  overflow-y-auto"
      >
        {/* Modal Header */}
        <div className="sticky top-0 bg-gradient-to-r from-rose-700 to-rose-900 p-5 text-white z-10">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl md:text-2xl font-bold">
                Add New Saree Product
              </h2>
              <p className="opacity-90 text-sm mt-1">
                Fill in the details of your exquisite saree
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 md:p-6">
          {/* Status Messages */}
          {isSuccess && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
              Product added successfully!
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
              {error.data?.message || "Failed to add product"}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
            {/* Left Column - Image Upload */}
            <div>
              <label
                className={cn(
                  "block mb-3 font-medium",
                  theme === "dark" ? "text-gray-300" : "text-gray-600"
                )}
              >
                Media Attachments
              </label>

              <div
                onClick={() => fileInputRef.current.click()}
                className={cn(
                  "rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors",
                  theme === "dark"
                    ? "border-gray-700 hover:border-orange-500 bg-gray-800/30"
                    : "border-gray-300 hover:border-orange-400 bg-white/50"
                )}
              >
                <input
                  type="file"
                  accept="image/*,.pdf"
                  multiple
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center">
                  <div
                    className={cn(
                      "p-3 rounded-full mb-3",
                      theme === "dark" ? "bg-gray-700" : "bg-gray-100"
                    )}
                  >
                    <CloudUploadIcon className="h-8 w-8" />
                  </div>
                  <p className="font-medium">
                    <span className="text-orange-500">Click to upload</span> or
                    drag and drop
                  </p>
                  <p className="text-sm mt-1">
                    Images and PDFs (max 10MB each)
                  </p>
                </div>
              </div>

              {/* File Previews */}
              {previewFiles.length > 0 && (
                <div className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {previewFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type === "image" ? (
                          <div className="aspect-square">
                            <img
                              src={file.url}
                              alt={`preview-${index}`}
                              className="w-full h-full object-cover rounded-lg border"
                            />
                          </div>
                        ) : (
                          <div className="border rounded-lg h-24 flex flex-col items-center justify-center p-2 bg-blue-50/50">
                            <DocumentTextIcon className="h-6 w-6 text-blue-500" />
                            <span className="text-xs mt-1 truncate w-full px-1">
                              {file.name}
                            </span>
                          </div>
                        )}
                        <button
                          onClick={() => removeFile(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Remove"
                        >
                          <XIcon className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Form Fields */}
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Title */}
                <div className="md:col-span-2">
                  <label className="block text-gray-700 font-medium mb-2">
                    Saree Title*
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Banarasi Silk Red Bridal Saree"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300 focus:border-transparent"
                    required
                  />
                </div>

                {/* Category Dropdown */}
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2">
                    Category*
                  </label>
                  <div
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer"
                    onClick={() =>
                      setShowCategoryDropdown(!showCategoryDropdown)
                    }
                  >
                    <span className={formData.category ? "" : "text-gray-400"}>
                      {formData.category || "Select category"}
                    </span>
                    <FiChevronDown className="text-gray-500 transition-transform duration-200" />
                  </div>

                  {showCategoryDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          value={newCategory}
                          onChange={(e) => setNewCategory(e.target.value)}
                          placeholder="Add new category"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={addNewCategory}
                          className="mt-2 w-full py-2 bg-rose-600 text-white rounded hover:bg-rose-700 flex items-center justify-center text-sm"
                        >
                          <FiPlus className="mr-1" /> Add
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {categories.map((category) => (
                          <div
                            key={category}
                            className={`p-3 hover:bg-rose-50 cursor-pointer text-sm ${
                              formData.category === category
                                ? "bg-rose-100 text-rose-800"
                                : ""
                            }`}
                            onClick={() => handleCategorySelect(category)}
                          >
                            {category}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Brand Dropdown */}
                <div className="relative">
                  <label className="block text-gray-700 font-medium mb-2">
                    Brand*
                  </label>
                  <div
                    className="flex items-center justify-between p-3 border border-gray-300 rounded-lg cursor-pointer"
                    onClick={() => setShowBrandDropdown(!showBrandDropdown)}
                  >
                    <span className={formData.brand ? "" : "text-gray-400"}>
                      {formData.brand || "Select brand"}
                    </span>
                    <FiChevronDown className="text-gray-500 transition-transform duration-200" />
                  </div>

                  {showBrandDropdown && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                      <div className="p-2 border-b">
                        <input
                          type="text"
                          value={newBrand}
                          onChange={(e) => setNewBrand(e.target.value)}
                          placeholder="Add new brand"
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                        />
                        <button
                          type="button"
                          onClick={addNewBrand}
                          className="mt-2 w-full py-2 bg-rose-600 text-white rounded hover:bg-rose-700 flex items-center justify-center text-sm"
                        >
                          <FiPlus className="mr-1" /> Add
                        </button>
                      </div>

                      <div className="max-h-60 overflow-y-auto">
                        {brands.map((brand) => (
                          <div
                            key={brand}
                            className={`p-3 hover:bg-rose-50 cursor-pointer text-sm ${
                              formData.brand === brand
                                ? "bg-rose-100 text-rose-800"
                                : ""
                            }`}
                            onClick={() => handleBrandSelect(brand)}
                          >
                            {brand}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Fabric */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Fabric Type*
                  </label>
                  <input
                    type="text"
                    name="fabric"
                    value={formData.fabric}
                    onChange={handleChange}
                    placeholder="e.g. Pure Silk, Cotton Blend"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Price (₹)*
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="e.g. 5999"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                    required
                  />
                </div>

                {/* Sale Price */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sale Price (₹)
                  </label>
                  <input
                    type="number"
                    name="salePrice"
                    value={formData.salePrice}
                    onChange={handleChange}
                    placeholder="e.g. 4999"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Available Stock*
                  </label>
                  <input
                    type="number"
                    name="totalStock"
                    value={formData.totalStock}
                    onChange={handleChange}
                    placeholder="e.g. 50"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                    required
                  />
                </div>

                {/* Length */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Saree Length (meters)*
                  </label>
                  <input
                    type="number"
                    name="length"
                    value={formData.length}
                    onChange={handleChange}
                    placeholder="e.g. 5.5"
                    step="0.1"
                    min="0"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                    required
                  />
                </div>

                {/* Occasion */}
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Occasion*
                  </label>
                  <select
                    name="occasion"
                    value={formData.occasion}
                    onChange={handleChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                    required
                  >
                    <option value="">Select occasion</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Festive">Festive</option>
                    <option value="Casual">Casual</option>
                    <option value="Party">Party</option>
                    <option value="Formal">Formal</option>
                  </select>
                </div>

                {/* Blouse Included */}
                <div className="flex items-center md:col-span-2">
                  <input
                    type="checkbox"
                    name="blouseIncluded"
                    checked={formData.blouseIncluded}
                    onChange={handleChange}
                    className="h-5 w-5 text-rose-600 rounded focus:ring-rose-300"
                    id="blouseIncluded"
                  />
                  <label
                    htmlFor="blouseIncluded"
                    className="ml-2 text-gray-700"
                  >
                    Blouse Included
                  </label>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">
                  Saree Description*
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Describe the saree in detail (material, design, border, pallu, etc.)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-300"
                  required
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className={`px-8 py-3 rounded-lg font-medium text-white shadow transition-all
                ${
                  isLoading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-rose-700 to-rose-900 hover:from-rose-800 hover:to-rose-950 hover:shadow-md"
                }`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Add Saree Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductCreateModal;
