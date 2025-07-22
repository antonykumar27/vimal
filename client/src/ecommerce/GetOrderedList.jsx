import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../../store/api/ProductAdminApi";
import {
  FaTrash,
  FaPlus,
  FaMinus,
  FaShoppingCart,
  FaSpinner,
  FaExclamationTriangle,
  FaArrowRight,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import UserHeader from "./UserHeader";
import { useNavigate } from "react-router-dom";
import debounce from "lodash/debounce";
function CartPage() {
  const { data, isLoading, error, refetch } = useGetCartQuery();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [removingItem, setRemovingItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [localQuantities, setLocalQuantities] = useState({});

  const [isUpdating, setIsUpdating] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    refetch();
  }, [refetch, data]);
  // Initialize local quantities from server data
  useEffect(() => {
    if (data?.cart?.items) {
      const initialQuantities = {};
      data.cart.items.forEach((item) => {
        initialQuantities[item?.productId._id] = item.quantity;
      });
      setLocalQuantities(initialQuantities);
    }
  }, [data]);
  console.log("localQuantities", localQuantities);
  const debouncedUpdate = useRef(
    debounce(async (itemId, quantity) => {
      console.log("itemId", itemId);
      console.log("quantity", quantity); // ✅ Correct variable
      try {
        await updateCartItem({ itemId, quantity }).unwrap();
        console.log("✅ Debounced update:", itemId, quantity);
        refetch();
      } catch (err) {
        console.error("❌ Update failed:", err);
      }
    }, 500)
  ).current;

  const handleLocalQuantityChange = (itemId, change) => {
    const newQuantity = Math.max(1, (localQuantities[itemId] || 1) + change);

    setLocalQuantities((prev) => ({
      ...prev,
      [itemId]: newQuantity,
    }));

    console.log("✔️ Calling debouncedUpdate with:", itemId, newQuantity);
    debouncedUpdate(itemId, newQuantity);
  };

  // Confirm deletion
  const confirmDelete = (item) => {
    console.log("item", item);
    setItemToDelete(item);
  };

  // Cancel deletion
  const cancelDelete = () => {
    setItemToDelete(null);
  };

  // Handle item removal
  const handleRemoveItem = async () => {
    if (!itemToDelete.productId) return;
    console.log("itemToDelete", itemToDelete);
    setRemovingItem(itemToDelete.productId._id);

    try {
      await removeCartItem(itemToDelete._id).unwrap();
      refetch();
    } catch (err) {
      console.error("Failed to remove item:", err);
    } finally {
      setRemovingItem(null);
      setItemToDelete(null);
    }
  };

  // Update quantities on server
  //   const updateQuantities = useCallback(async () => {
  //     setIsUpdating(true);
  //     try {
  //       const updates = Object.entries(localQuantities).map(
  //         ([itemId, quantity]) => {
  //           // Only update if quantity changed
  //           const serverItem = data?.cart?.items.find(
  //             (item) => item?.productId._id === itemId
  //           );
  //           if (serverItem && serverItem.quantity !== quantity) {
  //             return updateCartItem({ itemId, quantity }).unwrap();
  //           }
  //           return Promise.resolve();
  //         }
  //       );

  //       await Promise.all(updates);
  //       refetch();
  //     } catch (err) {
  //       console.error("Failed to update quantities:", err);
  //     } finally {
  //       setIsUpdating(false);
  //     }
  //   }, [localQuantities, data, updateCartItem, refetch]);

  // Calculate total price
  const calculateTotal = useCallback(() => {
    if (!data?.cart?.items) return 0;

    return data.cart.items.reduce((total, item) => {
      const price = item.productId.salePrice || item.productId.price;
      const quantity = localQuantities[item?.productId._id] || item.quantity;
      return total + price * quantity;
    }, 0);
  }, [data, localQuantities]);

  // Handle checkout
  const handleCheckout = async () => {
    navigate("/orderCreate");
  };

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <FaSpinner className="animate-spin text-4xl text-indigo-600" />
      </div>
    );

  if (error)
    return (
      <div className="max-w-4xl mx-auto p-4">
        <div className="bg-red-50 p-6 rounded-xl flex items-start gap-4">
          <FaExclamationTriangle className="text-red-500 text-2xl mt-1" />
          <div>
            <h2 className="text-xl font-bold text-red-800">
              Error Loading Cart
            </h2>
            <p className="text-red-700 mt-2">
              {error?.data?.message ||
                "Failed to load your cart. Please try again later."}
            </p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );

  if (!data?.cart?.items?.length)
    return (
      <>
        <UserHeader />
        <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-gray-100 p-6 rounded-full mb-6">
            <FaShoppingCart className="text-5xl text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Cart is Empty
          </h1>
          <p className="text-gray-600 max-w-md mx-auto mb-8">
            Looks like you haven't added anything to your cart yet. Start
            shopping to fill it!
          </p>
          <button
            onClick={() => navigate("/home")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            Continue Shopping
          </button>
        </div>
      </>
    );

  return (
    <>
      <UserHeader />
      <div className="max-w-6xl mx-auto p-4 sm:p-6">
        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {itemToDelete && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    Confirm Removal
                  </h3>
                  <button
                    onClick={cancelDelete}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>

                <p className="text-gray-600 mb-6">
                  Are you sure you want to remove{" "}
                  <span className="font-semibold">
                    {itemToDelete.productId.title}
                  </span>{" "}
                  from your cart?
                </p>

                <div className="flex justify-end gap-3">
                  <button
                    onClick={cancelDelete}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleRemoveItem}
                    disabled={removingItem === itemToDelete._id}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2 disabled:opacity-70"
                  >
                    {removingItem === itemToDelete._id ? (
                      <FaSpinner className="animate-spin" />
                    ) : (
                      <FaTrash />
                    )}
                    Remove
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Your Shopping Cart
          </h1>
          <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
            {data.cart.items.length}{" "}
            {data.cart.items.length > 1 ? "items" : "item"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
                <div className="col-span-5">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-3 text-center">Quantity</div>
                <div className="col-span-2 text-right">Subtotal</div>
              </div>

              <AnimatePresence>
                {data.cart.items.map((item) => (
                  <motion.div
                    key={item?.productId._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                    className="border-b border-gray-200 last:border-0"
                  >
                    <div className="grid grid-cols-12 gap-4 px-4 sm:px-6 py-6 items-center">
                      {/* Product Info */}
                      <div className="col-span-12 md:col-span-5 flex items-center gap-4">
                        <div className="relative">
                          <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 sm:w-20 sm:h-20 overflow-hidden">
                            {item.productId.media?.[0]?.url && (
                              <img
                                src={item.productId.media[0].url}
                                alt={item.productId.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                          {removingItem === item?.productId._id && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                              <FaSpinner className="animate-spin text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-800 truncate">
                            {item.productId.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            SKU: {item.productId._id.slice(-6)}
                          </p>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="col-span-4 md:col-span-2 flex md:flex-col md:items-center gap-1">
                        <span className="md:hidden text-gray-600">Price:</span>
                        <div className="flex flex-col">
                          {item.productId.salePrice ? (
                            <>
                              <span className="font-medium text-indigo-600">
                                ₹{item.productId.salePrice.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                ₹{item.productId.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="font-medium text-gray-800">
                              ₹{item.productId.price.toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                      {console.log("item", item)}
                      {/* Quantity Controls */}
                      <div className="col-span-5 md:col-span-3">
                        <div className="flex items-center justify-between max-w-[140px] mx-auto">
                          <button
                            onClick={() =>
                              handleLocalQuantityChange(item?.productId._id, -1)
                            }
                            disabled={
                              (localQuantities[item?.productId._id] ||
                                item.quantity) <= 1
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <FaMinus className="text-xs" />
                          </button>

                          <span className="w-10 text-center font-medium text-sm sm:text-base">
                            {localQuantities[item?.productId._id] ||
                              item.quantity}
                          </span>

                          <button
                            onClick={() =>
                              handleLocalQuantityChange(item?.productId._id, 1)
                            }
                            className="w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200"
                          >
                            <FaPlus className="text-xs" />
                          </button>
                        </div>
                      </div>

                      {/* Subtotal */}
                      <div className="col-span-3 md:col-span-2 flex items-center justify-end gap-2">
                        <span className="md:hidden text-gray-600">
                          Subtotal:
                        </span>
                        <span className="font-medium text-gray-800">
                          ₹
                          {(
                            (item.productId.salePrice || item.productId.price) *
                            (localQuantities[item?.productId._id] ||
                              item.quantity)
                          ).toFixed(2)}
                        </span>

                        <button
                          onClick={() => confirmDelete(item)}
                          className="ml-2 text-red-500 hover:text-red-700 transition-colors"
                        >
                          <FaTrash className="text-sm sm:text-base" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-6 pb-2 border-b border-gray-200">
                Order Summary
              </h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{calculateTotal().toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">₹5.99</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ₹{(calculateTotal() * 0.1).toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between pt-4 border-t border-gray-200 font-bold text-lg">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    ₹{(calculateTotal() * 1.1 + 5.99).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <button
                  className="w-full py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center"
                  onClick={handleCheckout}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" /> Updating...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <FaArrowRight className="ml-2" />
                    </>
                  )}
                </button>

                <button
                  className="w-full py-2.5 text-indigo-600 font-medium rounded-lg border border-indigo-600 hover:bg-indigo-50 transition-colors"
                  onClick={() => navigate("/home")}
                >
                  Continue Shopping
                </button>
              </div>
            </div>

            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-100">
              <h3 className="font-bold text-indigo-800 mb-2">Free Shipping</h3>
              <p className="text-gray-700 text-sm">
                Get free shipping on orders over $100. Your order qualifies for
                free shipping!
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default CartPage;
