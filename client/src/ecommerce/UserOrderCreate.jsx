import React, { useState, useEffect } from "react";
import {
  useCreateProductOrderMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
} from "../../store/api/ProductAdminApi";

import {
  FaCheckCircle,
  FaExclamationTriangle,
  FaSpinner,
  FaTruck,
  FaPlus,
  FaMinus,
  FaCreditCard,
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaGlobe,
  FaCity,
  FaPhone,
  FaBarcode,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const OrderForm = () => {
  const navigate = useNavigate();

  const [createOrder, { isLoading, isSuccess, isError, error }] =
    useCreateProductOrderMutation();
  const {
    data,
    isLoading: isLoadingGet,
    error: isErrors,
    refetch,
  } = useGetCartQuery();
  console.log("data", data);
  const [orderData, setOrderData] = useState({
    shippingInfo: {
      address: "",
      country: "",
      city: "",
      phoneNo: "",
      postalCode: "",
    },
    orderItems: [],
    paymentMode: "",
    paymentInfo: {
      id: null,
      status: "Pending",
    },
    itemsPrice: 0,
    taxPrice: 0,
    shippingPrice: 0,
    totalPrice: 0,
  });
  console.log("orderData", orderData);
  useEffect(() => {
    if (data?.cart?.items?.length > 0) {
      const orderItems = data.cart.items.map((item) => ({
        name: item.productId.title,
        quantity: item.quantity,
        image: item.productId.media?.[0]?.url || "",
        price: item.productId.salePrice || item.productId.price || 0,
        productId: item.productId._id,
      }));

      const itemsPrice = orderItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );

      const taxPrice = Number((itemsPrice * 0.1).toFixed(2)); // 10% tax
      const shippingPrice = itemsPrice > 1000 ? 0 : 50; // e.g., free shipping above ₹1000
      const totalPrice = itemsPrice + taxPrice + shippingPrice;

      setOrderData((prev) => ({
        ...prev,
        orderItems,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
      }));
    }
  }, [data]);

  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({
      ...prev,
      shippingInfo: {
        ...prev.shippingInfo,
        [name]: value,
      },
    }));
  };

  const validateForm = () => {
    const errors = {};
    const { address, country, city, phoneNo, postalCode } =
      orderData.shippingInfo;

    if (!address.trim()) errors.address = "Address is required";
    if (!country.trim()) errors.country = "Country is required";
    if (!city.trim()) errors.city = "City is required";
    if (!phoneNo.trim()) errors.phoneNo = "Phone number is required";
    if (!postalCode.trim()) errors.postalCode = "Postal code is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      if (orderData.paymentMode === "CashOnDelivery") {
        // Confirm order immediately
        const order = await createOrder(orderData).unwrap();

        if (order.success) {
          navigate("/order/success", {
            state: { order: { order } },
          });
        }
      } else {
        // Redirect to payment with data
        navigate("/payment", { state: { orderData } });
      }
    } catch (err) {
      console.error("Order submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate prices on quantity change
  useEffect(() => {
    const basePrice = orderData.orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const tax = basePrice * 0.1;
    const shipping = basePrice > 50 ? 0 : 5;
    const total = basePrice + tax + shipping;

    setOrderData((prev) => ({
      ...prev,
      itemsPrice: parseFloat(basePrice.toFixed(2)),
      taxPrice: parseFloat(tax.toFixed(2)),
      shippingPrice: shipping,
      totalPrice: parseFloat(total.toFixed(2)),
    }));
  }, [orderData.orderItems]);

  // Update quantity handler
  const handleQuantityChange = (index, value) => {
    setOrderData((prev) => {
      const newOrderItems = [...prev.orderItems];
      newOrderItems[index] = {
        ...newOrderItems[index],
        quantity: Math.max(1, newOrderItems[index].quantity + value),
      };

      return {
        ...prev,
        orderItems: newOrderItems,
      };
    });
  };

  // Remove item
  const handleRemoveItem = (index) => {
    if (orderData.orderItems.length <= 1) return;

    setOrderData((prev) => {
      const newOrderItems = [...prev.orderItems];
      newOrderItems.splice(index, 1);
      return {
        ...prev,
        orderItems: newOrderItems,
      };
    });
  };

  const inputFields = [
    { name: "address", icon: FaMapMarkerAlt, placeholder: "Street address" },
    { name: "country", icon: FaGlobe, placeholder: "Country" },
    { name: "city", icon: FaCity, placeholder: "City" },
    { name: "phoneNo", icon: FaPhone, placeholder: "Phone number" },
    { name: "postalCode", icon: FaBarcode, placeholder: "Postal/ZIP code" },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="text-center py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-lg mb-4"
        >
          <FaTruck className="text-white text-2xl" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl sm:text-4xl font-bold text-gray-800"
        >
          Complete Your Order
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-gray-600 mt-2 max-w-md mx-auto"
        >
          Review your items and enter shipping information
        </motion.p>
      </div>

      {isError && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-6 p-4 bg-red-50 rounded-xl border border-red-200 shadow-sm flex items-start gap-3"
        >
          <FaExclamationTriangle className="text-red-500 mt-1 flex-shrink-0 text-xl" />
          <div>
            <h3 className="font-bold text-red-800">Submission Error</h3>
            <p className="text-red-700">
              {error?.data?.message ||
                "Failed to submit order. Please try again."}
            </p>
          </div>
        </motion.div>
      )}

      {isSuccess ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-12 bg-white rounded-2xl shadow-lg border border-gray-100"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 10, -10, 0],
            }}
            transition={{ duration: 0.8 }}
          >
            <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Order Confirmed!
          </h2>
          <p className="text-gray-600 max-w-md mx-auto text-lg">
            Your order #ORD-{Math.floor(Math.random() * 10000)} has been placed
            successfully.
          </p>
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl max-w-md mx-auto">
            <h3 className="font-bold text-gray-800 mb-2">
              Delivery Information
            </h3>
            <p className="text-gray-700">
              Estimated delivery:{" "}
              {new Date(
                Date.now() + 5 * 24 * 60 * 60 * 1000
              ).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 font-medium"
          >
            Continue Shopping
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Your Order</h2>
            </div>

            <div className="space-y-4 p-5">
              {orderData.orderItems.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-start p-4 bg-gray-50 rounded-xl border border-gray-200"
                >
                  {/* <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-full" />
                  </div> */}
                  <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg overflow-hidden">
                    <img
                      src={orderData?.orderItems?.[0]?.image}
                      alt="Product"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="ml-4 flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 truncate">
                      {item.name}
                    </h3>
                    <p className="text-indigo-600 font-semibold">
                      ${item.price.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <FaMinus className="text-xs" />
                    </button>
                    <span className="w-8 text-center font-medium">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleQuantityChange(index, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      <FaPlus className="text-xs" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveItem(index)}
                    className="ml-4 text-red-500 hover:text-red-700 transition-colors"
                  >
                    Remove
                  </button>
                </motion.div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="p-5 border-t border-gray-200">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ${orderData.itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span className="font-medium">
                    ${orderData.taxPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span
                    className={`font-medium ${
                      orderData.shippingPrice === 0 ? "text-green-600" : ""
                    }`}
                  >
                    {orderData.shippingPrice === 0
                      ? "FREE"
                      : `$${orderData.shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-xl">
                  <span>Total</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                    ${orderData.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Shipping Information */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaTruck className="text-indigo-600" /> Shipping Information
              </h2>
            </div>

            <div className="p-5 grid grid-cols-1 gap-5">
              {inputFields.map((field, index) => (
                <motion.div
                  key={field.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * index + 0.5 }}
                  className="space-y-2"
                >
                  <label className="block text-sm font-medium text-gray-700 flex items-center gap-2">
                    <field.icon className="text-indigo-600" />
                    {field.name.replace(/([A-Z])/g, " $1").trim()}
                  </label>
                  <input
                    name={field.name}
                    value={orderData.shippingInfo[field.name]}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 pl-11 border rounded-xl focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 ${
                      formErrors[field.name]
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    placeholder={field.placeholder}
                  />
                  {formErrors[field.name] && (
                    <p className="text-red-500 text-sm">
                      {formErrors[field.name]}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Payment Options */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden"
          >
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                Payment Method
              </h2>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: "CashOnDelivery",
                  icon: FaMoneyBillWave,
                  label: "Cash on Delivery",
                },
                { id: "Online", icon: FaCreditCard, label: "Online Payment" },
              ].map((method) => (
                <motion.div
                  key={method.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <input
                    type="radio"
                    name="paymentMode"
                    id={method.id}
                    className="hidden"
                    checked={orderData.paymentMode === method.id}
                    onChange={() =>
                      setOrderData((prev) => ({
                        ...prev,
                        paymentMode: method.id,
                      }))
                    }
                  />
                  <label
                    htmlFor={method.id}
                    className={`block p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      orderData.paymentMode === method.id
                        ? "border-indigo-500 bg-indigo-50 shadow-sm"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-3 rounded-lg ${
                          orderData.paymentMode === method.id
                            ? "bg-indigo-100 text-indigo-700"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        <method.icon className="text-xl" />
                      </div>
                      <span className="font-medium">{method.label}</span>
                    </div>
                    {method.id === "Online" &&
                      orderData.paymentMode === method.id && (
                        <div className="mt-3 flex space-x-2">
                          {["visa", "mastercard", "paypal"].map((type, i) => (
                            <div
                              key={i}
                              className="bg-gray-100 border rounded-lg w-10 h-6 flex items-center justify-center"
                            >
                              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-3" />
                            </div>
                          ))}
                        </div>
                      )}
                  </label>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Submit Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="sticky bottom-4 z-10"
          >
            <button
              type="submit"
              disabled={isLoading || isSubmitting}
              className="w-full py-4 px-6 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5 focus:ring-2 focus:ring-indigo-300 focus:ring-opacity-50 disabled:opacity-80"
            >
              {isLoading || isSubmitting ? (
                <div className="flex items-center justify-center">
                  <FaSpinner className="animate-spin mr-2" /> Processing
                  Payment...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>Procedure to Payment</span>
                  <span className="ml-3 bg-indigo-800 px-3 py-1 rounded-full text-sm">
                    ${orderData.totalPrice.toFixed(2)}
                  </span>
                </div>
              )}
            </button>
          </motion.div>
        </form>
      )}
    </div>
  );
};

export default OrderForm;
