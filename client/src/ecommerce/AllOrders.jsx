import React, { useState } from "react";
import { useGetProductAllOrderQuery } from "../../store/api/ProductAdminApi";
import {
  FaSearch,
  FaFilter,
  FaEye,
  FaEdit,
  FaTrash,
  FaShoppingCart,
  FaBox,
  FaTruck,
  FaCheckCircle,
  FaTimesCircle,
  FaMoneyBillWave,
  FaUser,
  FaCalendarAlt,
  FaChevronDown,
  FaChevronUp,
  FaSort,
  FaSortUp,
  FaSortDown,
} from "react-icons/fa";
import { motion } from "framer-motion";

const AllOrders = () => {
  const { data, isLoading, isError } = useGetProductAllOrderQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Format date to readable format
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Handle sorting
  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  // Get sort icon
  const getSortIcon = (key) => {
    if (sortConfig.key !== key)
      return <FaSort className="ml-1 text-gray-400" />;
    if (sortConfig.direction === "asc")
      return <FaSortUp className="ml-1 text-blue-500" />;
    return <FaSortDown className="ml-1 text-blue-500" />;
  };

  // Filter and sort orders
  const filteredOrders = data?.orders
    ? [...data.orders]
        .filter((order) => {
          // Search filter
          const matchesSearch =
            order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.user.email.toLowerCase().includes(searchTerm.toLowerCase());

          // Status filter
          const matchesStatus =
            statusFilter === "all" ||
            (statusFilter === "paid" && order.isPaid) ||
            (statusFilter === "unpaid" && !order.isPaid) ||
            (statusFilter === "delivered" && order.isDelivered) ||
            (statusFilter === "processing" &&
              !order.isDelivered &&
              order.orderStatus === "Processing") ||
            (statusFilter === "shipped" && order.orderStatus === "Shipped");

          // Payment filter
          const matchesPayment =
            paymentFilter === "all" ||
            (paymentFilter === "succeeded" &&
              order.paymentInfo?.status === "succeeded") ||
            (paymentFilter === "pending" &&
              order.paymentInfo?.status === "pending") ||
            (paymentFilter === "failed" &&
              order.paymentInfo?.status === "failed");

          return matchesSearch && matchesStatus && matchesPayment;
        })
        .sort((a, b) => {
          if (sortConfig.key === "createdAt") {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return sortConfig.direction === "asc"
              ? dateA - dateB
              : dateB - dateA;
          }
          if (sortConfig.key === "totalPrice") {
            return sortConfig.direction === "asc"
              ? a.totalPrice - b.totalPrice
              : b.totalPrice - a.totalPrice;
          }
          if (sortConfig.key === "customer") {
            const nameA = a.user.name.toLowerCase();
            const nameB = b.user.name.toLowerCase();
            return sortConfig.direction === "asc"
              ? nameA.localeCompare(nameB)
              : nameB.localeCompare(nameA);
          }
          return 0;
        })
    : [];

  // Toggle order details
  const toggleOrderDetails = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  // Update order status (simulated)
  const updateOrderStatus = (orderId, newStatus) => {
    console.log(`Updating order ${orderId} to status: ${newStatus}`);
    // In a real app, this would dispatch an API call to update the order
    alert(`Order status updated to: ${newStatus}`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-700">Loading orders...</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">
          Error loading orders
        </h3>
        <p className="text-red-600">Please try again later</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Order Management
              </h2>
              <p className="text-gray-600 mt-1">
                Total Orders: {data?.totalOrders} | Total Revenue:{" "}
                {formatCurrency(data?.totalAmount || 0)}
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                Export Orders
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Order Status
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Payment Status
              </label>
              <select
                className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
              >
                <option value="all">All Payments</option>
                <option value="succeeded">Succeeded</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date Range
              </label>
              <select className="w-full py-2 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
                <option>All time</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("createdAt")}
                >
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" /> Date{" "}
                    {getSortIcon("createdAt")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Order ID
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("customer")}
                >
                  <div className="flex items-center">
                    <FaUser className="mr-2" /> Customer{" "}
                    {getSortIcon("customer")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Items
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("totalPrice")}
                >
                  <div className="flex items-center">
                    <FaMoneyBillWave className="mr-2" /> Total{" "}
                    {getSortIcon("totalPrice")}
                  </div>
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Payment
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No orders found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => toggleOrderDetails(order._id)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(order.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-blue-600">
                          #{order._id.substring(0, 8)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {order.user.email}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {order.orderItems.length} item
                          {order.orderItems.length > 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {formatCurrency(order.totalPrice)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.isPaid
                              ? "bg-green-100 text-green-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.isPaid ? "Paid" : "Pending"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            order.orderStatus === "Processing"
                              ? "bg-blue-100 text-blue-800"
                              : order.orderStatus === "Shipped"
                              ? "bg-purple-100 text-purple-800"
                              : order.orderStatus === "Delivered"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button
                            className="text-blue-600 hover:text-blue-900"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleOrderDetails(order._id);
                            }}
                          >
                            {expandedOrder === order._id ? (
                              <FaChevronUp />
                            ) : (
                              <FaChevronDown />
                            )}
                          </button>
                          <button
                            className="text-gray-600 hover:text-gray-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEye />
                          </button>
                          <button
                            className="text-green-600 hover:text-green-900"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <FaEdit />
                          </button>
                        </div>
                      </td>
                    </tr>

                    {/* Expanded Order Details */}
                    {expandedOrder === order._id && (
                      <tr>
                        <td colSpan="8" className="px-6 py-4 bg-gray-50">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            transition={{ duration: 0.3 }}
                            className="bg-white rounded-lg border border-gray-200 p-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Order Items */}
                              <div className="md:col-span-2">
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                  Order Items
                                </h3>
                                <div className="space-y-4">
                                  {order.orderItems.map((item, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center border-b pb-3"
                                    >
                                      <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden bg-gray-200">
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <div className="ml-4 flex-1">
                                        <h4 className="text-sm font-medium text-gray-900">
                                          {item.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                          Qty: {item.quantity}
                                        </p>
                                      </div>
                                      <div className="ml-4">
                                        <p className="text-sm font-medium text-gray-900">
                                          {formatCurrency(item.price)}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>

                                {/* Order Summary */}
                                <div className="mt-6 bg-gray-50 rounded-lg p-4">
                                  <h3 className="text-lg font-medium text-gray-800 mb-3">
                                    Order Summary
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Items Price
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(order.itemsPrice)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">
                                        Shipping
                                      </span>
                                      <span className="font-medium">
                                        {formatCurrency(order.shippingPrice)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between">
                                      <span className="text-gray-600">Tax</span>
                                      <span className="font-medium">
                                        {formatCurrency(order.taxPrice)}
                                      </span>
                                    </div>
                                    <div className="flex justify-between pt-2 border-t border-gray-200">
                                      <span className="text-gray-900 font-medium">
                                        Total
                                      </span>
                                      <span className="text-gray-900 font-bold">
                                        {formatCurrency(order.totalPrice)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Order Details */}
                              <div>
                                <h3 className="text-lg font-medium text-gray-800 mb-3">
                                  Order Details
                                </h3>
                                <div className="bg-gray-50 rounded-lg p-4 space-y-4">
                                  {/* Payment Info */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      Payment Information
                                    </h4>
                                    <div className="flex items-center">
                                      {order.isPaid ? (
                                        <FaCheckCircle className="text-green-500 mr-2" />
                                      ) : (
                                        <FaTimesCircle className="text-red-500 mr-2" />
                                      )}
                                      <span className="text-sm">
                                        {order.isPaid
                                          ? `Paid on ${formatDate(
                                              order.paidAt
                                            )}`
                                          : "Payment Pending"}
                                      </span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                      {order.paymentInfo?.id &&
                                        `Transaction ID: ${order.paymentInfo.id.substring(
                                          0,
                                          12
                                        )}...`}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Status:{" "}
                                      {order.paymentInfo?.status || "Pending"}
                                    </p>
                                  </div>

                                  {/* Shipping Info */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      Shipping Information
                                    </h4>
                                    <p className="text-sm">
                                      {order.shippingInfo.address},{" "}
                                      {order.shippingInfo.city},{" "}
                                      {order.shippingInfo.postalCode}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      Phone: {order.shippingInfo.phoneNo}
                                    </p>
                                  </div>

                                  {/* Order Status */}
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-700 mb-1">
                                      Order Status
                                    </h4>
                                    <div className="flex items-center mb-2">
                                      <div
                                        className={`w-3 h-3 rounded-full mr-2 ${
                                          order.orderStatus === "Processing"
                                            ? "bg-blue-500"
                                            : order.orderStatus === "Shipped"
                                            ? "bg-purple-500"
                                            : order.orderStatus === "Delivered"
                                            ? "bg-green-500"
                                            : "bg-gray-500"
                                        }`}
                                      ></div>
                                      <span className="text-sm font-medium">
                                        {order.orderStatus}
                                      </span>
                                    </div>

                                    <div className="flex space-x-2">
                                      <button
                                        className={`px-3 py-1 text-xs rounded ${
                                          order.orderStatus === "Processing"
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                        }`}
                                        onClick={() =>
                                          updateOrderStatus(
                                            order._id,
                                            "Processing"
                                          )
                                        }
                                      >
                                        Processing
                                      </button>
                                      <button
                                        className={`px-3 py-1 text-xs rounded ${
                                          order.orderStatus === "Shipped"
                                            ? "bg-purple-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                        }`}
                                        onClick={() =>
                                          updateOrderStatus(
                                            order._id,
                                            "Shipped"
                                          )
                                        }
                                      >
                                        Shipped
                                      </button>
                                      <button
                                        className={`px-3 py-1 text-xs rounded ${
                                          order.orderStatus === "Delivered"
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                        }`}
                                        onClick={() =>
                                          updateOrderStatus(
                                            order._id,
                                            "Delivered"
                                          )
                                        }
                                      >
                                        Delivered
                                      </button>
                                    </div>
                                  </div>

                                  {/* Actions */}
                                  <div className="pt-4 border-t border-gray-200">
                                    <div className="flex space-x-2">
                                      <button className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded text-sm">
                                        Print Invoice
                                      </button>
                                      <button className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded text-sm">
                                        Send Email
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-white border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-700 mb-4 md:mb-0">
              Showing <span className="font-medium">1</span> to{" "}
              <span className="font-medium">10</span> of{" "}
              <span className="font-medium">{filteredOrders.length}</span>{" "}
              results
            </div>
            <div className="flex space-x-2">
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                Previous
              </button>
              <button className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600">
                1
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                2
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                3
              </button>
              <button className="px-3 py-1 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300">
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllOrders;
