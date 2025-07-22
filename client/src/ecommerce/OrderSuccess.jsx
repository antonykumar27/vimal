import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function OrderSuccess() {
  const location = useLocation();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  console.log("order", order);
  const [loading, setLoading] = useState(true);
  const [showAnimation, setShowAnimation] = useState(false);
  console.log("location", location);
  useEffect(() => {
    const orderFromState = state?.response?.order;

    if (orderFromState) {
      setOrder(orderFromState);
    } else {
      console.warn("No order found in location.state");
      setOrder(null);
    }

    const timer = setTimeout(() => {
      setLoading(false);
      setShowAnimation(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []); // ✅ empty dependency array — run once

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("en-IN", options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-green-50 to-cyan-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">
            Loading your order details...
          </p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto p-4 sm:p-6 min-h-screen flex flex-col justify-center">
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-xl p-6 sm:p-8 text-center">
          <div className="text-red-500 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-12 sm:h-16 w-12 sm:w-16 mx-auto"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-3 sm:mb-4">
            Order Details Not Found
          </h2>
          <p className="text-gray-600 mb-4 sm:mb-6 text-sm sm:text-base">
            We couldn't retrieve your order information. Please check your order
            history or contact support.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/")}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-medium text-sm sm:text-base"
            >
              Continue Shopping
            </button>
            <button
              onClick={() => navigate("/orders")}
              className="px-4 py-2 sm:px-6 sm:py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition duration-300 font-medium text-sm sm:text-base"
            >
              View Orders
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-cyan-50 py-6 sm:py-12 px-3 sm:px-4">
      <div className="max-w-4xl mx-auto">
        {/* Animated Success Header */}
        <div
          className={`text-center mb-6 sm:mb-10 transition-all duration-1000 ${
            showAnimation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative inline-block">
            <svg
              className="h-16 sm:h-24 w-16 sm:w-24 text-green-500 mx-auto animate-tick"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="absolute top-0 right-0 -mt-1 sm:-mt-2 -mr-1 sm:-mr-2">
              <div className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></div>
              <div className="relative inline-flex rounded-full h-4 sm:h-6 w-4 sm:w-6 bg-green-500"></div>
            </div>
          </div>

          <h1 className="mt-4 sm:mt-6 text-xl sm:text-3xl md:text-4xl font-bold text-gray-900">
            {order.isPaid ? "Payment Successful!" : "Order Placed!"}
          </h1>
          <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-gray-600">
            Thank you for your order! We've sent a confirmation to your email.
          </p>
          <div className="mt-3 sm:mt-4 inline-flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-green-100 text-green-800 rounded-full text-xs sm:text-sm font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3 w-3 sm:h-4 sm:w-4 mr-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            Order ID:{" "}
            <span className="font-mono ml-1 text-xs sm:text-sm">
              {order._id.slice(0, 8)}...
            </span>
          </div>
        </div>

        {/* Order Summary Card */}
        <div
          className={`bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transition-all duration-700 ${
            showAnimation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                <path
                  fillRule="evenodd"
                  d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                  clipRule="evenodd"
                />
              </svg>
              Order Summary
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 p-4 sm:p-6">
            {/* Order Details */}
            <div>
              <div className="mb-4 sm:mb-6">
                <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Order Details
                </h3>
                <div className="space-y-1 sm:space-y-2 pl-5 sm:pl-7 text-sm sm:text-base">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-right">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span
                      className={`font-medium ${
                        order.orderStatus === "Processing"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span
                      className={`font-medium text-right ${
                        order.paymentInfo?.status === "Pending"
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      {order.paymentMode} • {order.paymentInfo?.status}
                    </span>
                  </div>
                  {order.paidAt && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Paid At:</span>
                      <span className="font-medium text-right">
                        {formatDate(order.paidAt)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Shipping Address
                </h3>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4 pl-5 sm:pl-7 text-sm sm:text-base">
                  <p className="font-medium">{order.shippingInfo?.address}</p>
                  <p className="text-gray-600">
                    {order.shippingInfo?.city}, {order.shippingInfo?.postalCode}
                  </p>
                  <p className="text-gray-600">{order.shippingInfo?.country}</p>
                  <p className="text-gray-600 mt-1 sm:mt-2">
                    Phone: {order.shippingInfo?.phoneNo}
                  </p>
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="mt-4 sm:mt-0">
              <h3 className="text-sm sm:text-md font-semibold text-gray-700 mb-2 sm:mb-3 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-gray-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                    clipRule="evenodd"
                  />
                </svg>
                Price Summary
              </h3>
              <div className="border rounded-lg divide-y text-sm sm:text-base">
                <div className="flex justify-between p-3 sm:p-4">
                  <span className="text-gray-600">
                    Items ({order.orderItems?.length})
                  </span>
                  <span>{formatCurrency(order.itemsPrice)}</span>
                </div>
                <div className="flex justify-between p-3 sm:p-4">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-green-600">FREE</span>
                </div>
                <div className="flex justify-between p-3 sm:p-4">
                  <span className="text-gray-600">Tax</span>
                  <span>{formatCurrency(order.taxPrice)}</span>
                </div>
                <div className="flex justify-between p-3 sm:p-4 bg-gray-50 font-bold text-base sm:text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    {formatCurrency(order.totalPrice)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Ordered Items */}
        <div
          className={`mt-6 sm:mt-8 bg-white rounded-xl sm:rounded-2xl shadow-xl overflow-hidden transition-all duration-1000 ${
            showAnimation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <div className="p-4 sm:p-6 border-b">
            <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-green-600"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"
                  clipRule="evenodd"
                />
              </svg>
              Items Ordered
            </h2>
          </div>

          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {order.orderItems?.map((item, index) => (
                <div
                  key={index}
                  className="flex items-start p-3 sm:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {console.log("item", item)}
                  <div className="bg-red-400 border-2 border-dashed rounded-xl w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center overflow-hidden">
                    <img
                      src={item.image} // Replace with actual object if not named `order`
                      alt="Product"
                      className="object-cover w-full h-full rounded-xl"
                    />
                  </div>

                  <div className="ml-3 sm:ml-4 flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-sm sm:text-base truncate">
                      {item.name}
                    </h3>
                    <div className="mt-1 flex flex-wrap items-center text-xs sm:text-sm text-gray-500">
                      <span>Price: {formatCurrency(item.price)}</span>
                      <span className="mx-2 hidden sm:inline">•</span>
                      <span className="sm:ml-0 ml-2">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <div className="text-right min-w-[70px]">
                    <p className="font-medium text-sm sm:text-base">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div
          className={`mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4 transition-all duration-1200 ${
            showAnimation
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-8"
          }`}
        >
          <button
            onClick={() => navigate("/")}
            className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition duration-300 font-medium text-sm sm:text-base flex items-center justify-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm.707-10.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L9.414 11H13a1 1 0 100-2H9.414l1.293-1.293z"
                clipRule="evenodd"
              />
            </svg>
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="w-full px-4 py-2 sm:px-6 sm:py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition duration-300 font-medium text-sm sm:text-base flex items-center justify-center"
          >
            View Order Details
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 ml-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Support Info */}
        <div
          className={`mt-6 sm:mt-8 text-center text-gray-600 text-xs sm:text-sm transition-all duration-1500 ${
            showAnimation ? "opacity-100" : "opacity-0"
          }`}
        >
          <p>
            Need help with your order?{" "}
            <a href="/support" className="text-green-600 hover:underline">
              Contact support
            </a>
          </p>
          <p className="mt-1">Estimated delivery: Within 3-5 business days</p>
        </div>
      </div>
    </div>
  );
}

export default OrderSuccess;
