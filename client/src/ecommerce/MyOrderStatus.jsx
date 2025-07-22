import React, { useState } from "react";
import { useGetProductOrderQuery } from "../../store/api/ProductAdminApi";
import { format } from "date-fns";
import UserHeader from "./UserHeader";

function MyOrderStatus() {
  const { data, isLoading, error, refetch } = useGetProductOrderQuery();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-6 text-center">
          <div className="text-red-500 mx-auto mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-16 w-16 mx-auto"
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
          <h2 className="text-xl font-bold text-gray-800 mb-3">
            Error Loading Orders
          </h2>
          <p className="text-gray-600 mb-6">
            We couldn't retrieve your order information. Please try again later.
          </p>
          <button
            onClick={refetch}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-medium"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const orders = data?.orders || [];

  // Filter orders based on status
  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter(
          (order) => order.orderStatus.toLowerCase() === filterStatus
        );

  // Format currency for Indian Rupees
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Get status details (color, icon, text)
  const getStatusDetails = (status) => {
    switch (status.toLowerCase()) {
      case "processing":
        return {
          color: "bg-yellow-100 text-yellow-800",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          text: "Processing",
        };
      case "shipped":
        return {
          color: "bg-blue-100 text-blue-800",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0"
              />
            </svg>
          ),
          text: "Shipped",
        };
      case "delivered":
        return {
          color: "bg-green-100 text-green-800",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          text: "Delivered",
        };
      case "cancelled":
        return {
          color: "bg-red-100 text-red-800",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ),
          text: "Cancelled",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800",
          icon: (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          text: "Unknown",
        };
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 ">
      <UserHeader />
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Orders</h1>
          <p className="text-gray-600">
            View and manage all your orders in one place
          </p>
        </div>

        {/* Status Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
              filterStatus === "all"
                ? "bg-indigo-600 text-white shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            All Orders
          </button>
          <button
            onClick={() => setFilterStatus("processing")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
              filterStatus === "processing"
                ? "bg-yellow-100 text-yellow-800 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-yellow-500 mr-2"></span>
            Processing
          </button>
          <button
            onClick={() => setFilterStatus("shipped")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
              filterStatus === "shipped"
                ? "bg-blue-100 text-blue-800 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>
            Shipped
          </button>
          <button
            onClick={() => setFilterStatus("delivered")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
              filterStatus === "delivered"
                ? "bg-green-100 text-green-800 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
            Delivered
          </button>
          <button
            onClick={() => setFilterStatus("cancelled")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center ${
              filterStatus === "cancelled"
                ? "bg-red-100 text-red-800 shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
            Cancelled
          </button>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-indigo-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-indigo-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">
                No orders found
              </h3>
              <p className="mt-2 text-gray-500">
                {filterStatus === "all"
                  ? "You haven't placed any orders yet."
                  : `You don't have any ${filterStatus} orders.`}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusDetails = getStatusDetails(order.orderStatus);
                const isExpanded = expandedOrder === order._id;

                return (
                  <div
                    key={order._id}
                    className={`transition-all duration-300 ${
                      isExpanded ? "bg-gray-50" : "hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className="p-5 cursor-pointer"
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order._id)
                      }
                    >
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${statusDetails.color}`}
                            >
                              {statusDetails.icon}
                              {statusDetails.text}
                            </span>
                            <span className="ml-3 text-sm text-gray-500">
                              {format(
                                new Date(order.createdAt),
                                "dd MMM yyyy, hh:mm a"
                              )}
                            </span>
                          </div>
                          <h3 className="mt-2 text-lg font-medium text-gray-900">
                            Order #{order._id.slice(-8).toUpperCase()}
                          </h3>
                          <p className="mt-1 text-gray-600">
                            {order.orderItems.length} item
                            {order.orderItems.length !== 1 ? "s" : ""} • Total{" "}
                            {formatCurrency(order.totalPrice)}
                          </p>
                        </div>
                        <div className="mt-4 md:mt-0 flex items-center">
                          <button className="text-indigo-600 hover:text-indigo-900 font-medium">
                            {isExpanded ? "Hide details" : "View details"}
                          </button>
                          <svg
                            className={`ml-2 h-5 w-5 text-gray-400 transform transition-transform ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Order Details */}
                    {isExpanded && (
                      <div className="px-5 pb-5 transition-all duration-300">
                        <div className="border-t border-gray-200 pt-5">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Order Summary */}
                            <div>
                              <h4 className="text-md font-medium text-gray-900 mb-3">
                                Order Summary
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-4">
                                <div className="space-y-3">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Items Subtotal
                                    </span>
                                    <span className="font-medium">
                                      {formatCurrency(order.itemsPrice)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">
                                      Shipping
                                    </span>
                                    <span className="text-green-600">FREE</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Tax</span>
                                    <span>
                                      {formatCurrency(order.taxPrice)}
                                    </span>
                                  </div>
                                  <div className="flex justify-between pt-3 border-t border-gray-200 font-medium text-lg">
                                    <span>Total</span>
                                    <span className="text-indigo-600">
                                      {formatCurrency(order.totalPrice)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Shipping & Payment */}
                            <div>
                              <h4 className="text-md font-medium text-gray-900 mb-3">
                                Shipping & Payment
                              </h4>
                              <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500">
                                    Shipping Address
                                  </h5>
                                  <p className="mt-1">
                                    {order.shippingInfo.address},{" "}
                                    {order.shippingInfo.city},
                                    {order.shippingInfo.postalCode},{" "}
                                    {order.shippingInfo.country}
                                  </p>
                                  <p className="mt-1 text-gray-600">
                                    Phone: {order.shippingInfo.phoneNo}
                                  </p>
                                </div>
                                <div>
                                  <h5 className="text-sm font-medium text-gray-500">
                                    Payment Method
                                  </h5>
                                  <p className="mt-1 flex items-center">
                                    {order.paymentMode === "Online" ? (
                                      <>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5 text-green-500 mr-2"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                          />
                                        </svg>
                                        Online Payment (
                                        {order.paymentInfo?.status || "Pending"}
                                        )
                                      </>
                                    ) : (
                                      <>
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-5 w-5 text-gray-500 mr-2"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                                          />
                                        </svg>
                                        Cash on Delivery
                                      </>
                                    )}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Order Items */}
                          <div className="mt-6">
                            <h4 className="text-md font-medium text-gray-900 mb-3">
                              Items
                            </h4>
                            <div className="space-y-4">
                              {order.orderItems.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex border border-gray-200 rounded-lg p-4"
                                >
                                  <div className="flex-shrink-0">
                                    {item.image ? (
                                      <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-16 h-16 object-cover rounded-md"
                                      />
                                    ) : (
                                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 flex items-center justify-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          className="h-6 w-6 text-gray-400"
                                          fill="none"
                                          viewBox="0 0 24 24"
                                          stroke="currentColor"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                          />
                                        </svg>
                                      </div>
                                    )}
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <h5 className="font-medium text-gray-900">
                                      {item.name}
                                    </h5>
                                    <p className="text-sm text-gray-500">
                                      Quantity: {item.quantity}
                                    </p>
                                    <p className="mt-1 font-medium">
                                      {formatCurrency(item.price)}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-medium">
                                      {formatCurrency(
                                        item.price * item.quantity
                                      )}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Order Actions */}
                          {order.orderStatus.toLowerCase() === "processing" && (
                            <div className="mt-6 flex flex-wrap gap-3">
                              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-300 font-medium">
                                Track Order
                              </button>
                              <button className="px-4 py-2 bg-white text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition duration-300 font-medium">
                                Cancel Order
                              </button>
                              <button className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300 font-medium">
                                Contact Support
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyOrderStatus;
