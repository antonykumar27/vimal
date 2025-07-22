import React, { useState } from "react";
import {
  FaUsers,
  FaShoppingCart,
  FaDollarSign,
  FaBox,
  FaChartLine,
  FaShoppingBag,
  FaUserPlus,
  FaCreditCard,
  FaExclamationTriangle,
  FaChevronDown,
  FaChevronUp,
  FaSearch,
  FaFilter,
  FaEllipsisV,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Analytics = () => {
  // State for various dashboard elements
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [expandedMetrics, setExpandedMetrics] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("sales");

  // Mock data for analytics
  const metrics = [
    {
      id: 1,
      title: "Total Customers",
      value: "12.8K",
      change: "+12.5%",
      icon: <FaUsers className="text-blue-500" />,
    },
    {
      id: 2,
      title: "Total Revenue",
      value: "$284.2K",
      change: "+18.3%",
      icon: <FaDollarSign className="text-green-500" />,
    },
    {
      id: 3,
      title: "Total Orders",
      value: "3.2K",
      change: "+8.2%",
      icon: <FaShoppingBag className="text-purple-500" />,
    },
    {
      id: 4,
      title: "Avg. Order Value",
      value: "$89.50",
      change: "+4.3%",
      icon: <FaChartLine className="text-yellow-500" />,
    },
    {
      id: 5,
      title: "Products Sold",
      value: "24.5K",
      change: "-1.2%",
      icon: <FaBox className="text-red-500" />,
    },
    {
      id: 6,
      title: "Conversion Rate",
      value: "3.8%",
      change: "+0.4%",
      icon: <FaChartLine className="text-teal-500" />,
    },
    {
      id: 7,
      title: "Return Rate",
      value: "8.2%",
      change: "-2.1%",
      icon: <FaBox className="text-orange-500" />,
    },
    {
      id: 8,
      title: "Customer Satisfaction",
      value: "4.7/5",
      change: "+0.2",
      icon: <FaStar className="text-amber-500" />,
    },
  ];

  const activities = [
    {
      id: 1,
      user: "Jane Cooper",
      action: "placed an order",
      time: "2 min ago",
      icon: <FaShoppingCart className="text-blue-500" />,
    },
    {
      id: 2,
      user: "John Doe",
      action: "registered as a new customer",
      time: "15 min ago",
      icon: <FaUserPlus className="text-green-500" />,
    },
    {
      id: 3,
      user: "Robert Fox",
      action: "completed payment of $320",
      time: "45 min ago",
      icon: <FaCreditCard className="text-purple-500" />,
    },
    {
      id: 4,
      user: "System",
      action: "5 products are low in stock",
      time: "1 hour ago",
      icon: <FaExclamationTriangle className="text-red-500" />,
    },
  ];

  const topProducts = [
    {
      id: 1,
      name: "Premium Headphones",
      category: "Electronics",
      price: "$199",
      sales: 142,
      stock: 15,
      rating: 4.8,
    },
    {
      id: 2,
      name: "Wireless Charger",
      category: "Accessories",
      price: "$39",
      sales: 98,
      stock: 42,
      rating: 4.5,
    },
    {
      id: 3,
      name: "Fitness Tracker",
      category: "Wearables",
      price: "$129",
      sales: 76,
      stock: 8,
      rating: 4.3,
    },
    {
      id: 4,
      name: "Bluetooth Speaker",
      category: "Audio",
      price: "$89",
      sales: 63,
      stock: 23,
      rating: 4.6,
    },
  ];

  const trafficSources = [
    {
      source: "Organic Search",
      percentage: 42,
      value: "12.4K",
      color: "bg-blue-500",
    },
    { source: "Direct", percentage: 23, value: "6.8K", color: "bg-green-500" },
    {
      source: "Social Media",
      percentage: 18,
      value: "5.3K",
      color: "bg-purple-500",
    },
    { source: "Email", percentage: 12, value: "3.5K", color: "bg-yellow-500" },
    { source: "Referral", percentage: 5, value: "1.5K", color: "bg-red-500" },
  ];

  // Sales chart data
  const salesData = [
    { day: "Mon", sales: 12000 },
    { day: "Tue", sales: 19000 },
    { day: "Wed", sales: 15000 },
    { day: "Thu", sales: 22000 },
    { day: "Fri", sales: 18000 },
    { day: "Sat", sales: 25000 },
    { day: "Sun", sales: 21000 },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className="text-amber-500">
          {i <= Math.floor(rating) ? <FaStar /> : <FaRegStar />}
        </span>
      );
    }
    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600">
              Monitor your store performance and metrics
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            <div className="bg-white rounded-lg border border-gray-300 px-3 py-2 flex items-center">
              <FaFilter className="text-gray-500 mr-2" />
              <select
                className="bg-transparent focus:outline-none"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
              >
                <option value="daily">Today</option>
                <option value="weekly">This Week</option>
                <option value="monthly">This Month</option>
                <option value="quarterly">This Quarter</option>
                <option value="yearly">This Year</option>
              </select>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Grid */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Key Metrics</h2>
          <button
            className="text-blue-500 flex items-center"
            onClick={() => setExpandedMetrics(!expandedMetrics)}
          >
            {expandedMetrics ? "Show Less" : "Show More"}
            {expandedMetrics ? (
              <FaChevronUp className="ml-1" />
            ) : (
              <FaChevronDown className="ml-1" />
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {metrics
            .slice(0, expandedMetrics ? metrics.length : 4)
            .map((metric, index) => (
              <motion.div
                key={metric.id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 rounded-lg bg-gray-50 mr-3">
                    {metric.icon}
                  </div>
                  <h3 className="text-gray-500 text-sm font-medium">
                    {metric.title}
                  </h3>
                </div>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-gray-800">
                    {metric.value}
                  </span>
                  <span
                    className={`text-sm font-medium px-2 py-1 rounded-full ${
                      metric.change.startsWith("+")
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {metric.change}
                  </span>
                </div>
                <div className="mt-4">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        metric.change.startsWith("+")
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                      style={{
                        width: `${Math.abs(parseInt(metric.change)) * 3}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </section>

      {/* Charts and Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sales Chart */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-sm p-6 lg:col-span-2"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Sales Performance
            </h2>
            <div className="flex space-x-2">
              {["sales", "orders", "traffic"].map((tab) => (
                <button
                  key={tab}
                  className={`px-3 py-1 rounded-lg text-sm font-medium ${
                    activeTab === tab
                      ? "bg-blue-500 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="h-64">
            <div className="flex items-end h-5/6 space-x-2">
              {salesData.map((day, index) => (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div className="text-xs text-gray-500 mb-1">{day.day}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.sales / 30000) * 100}%` }}
                    transition={{ duration: 0.8, delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg"
                  ></motion.div>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 mt-2 flex justify-between">
              <span className="text-sm text-gray-500">Last 7 days</span>
              <span className="text-sm font-medium text-blue-500">
                +18.3% from last week
              </span>
            </div>
          </div>
        </motion.div>

        {/* Traffic Sources */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Traffic Sources
          </h2>

          <div className="space-y-4">
            {trafficSources.map((source, index) => (
              <div key={index}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">
                    {source.source}
                  </span>
                  <span className="text-sm font-medium text-gray-700">
                    {source.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${source.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${source.percentage}%` }}
                    transition={{ duration: 1, delay: index * 0.1 }}
                  ></motion.div>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {source.value} visitors
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            Recent Activity
          </h2>

          <ul className="space-y-4">
            {activities.map((activity) => (
              <motion.li
                key={activity.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="p-2 rounded-lg bg-white shadow-sm mr-3">
                  {activity.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 truncate">
                    {activity.user}
                  </p>
                  <p className="text-gray-600 text-sm truncate">
                    {activity.action}
                  </p>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">
                  {activity.time}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Top Selling Products */}
        <motion.div
          variants={cardVariants}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Top Selling Products
            </h2>
            <button className="text-blue-500 text-sm font-medium">
              View All
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3">Sales</th>
                  <th className="pb-3">Rating</th>
                </tr>
              </thead>
              <tbody>
                {topProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-t border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3">
                      <div className="font-medium text-gray-800">
                        {product.name}
                      </div>
                    </td>
                    <td className="py-3">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 font-medium text-gray-800">
                      {product.price}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        <span className="font-medium mr-2">
                          {product.sales}
                        </span>
                        <span className="text-xs text-green-500 bg-green-100 px-1 rounded">
                          +12%
                        </span>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center">
                        {renderStars(product.rating)}
                        <span className="ml-2 text-sm text-gray-600">
                          {product.rating}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Upgrade Banner */}
      <motion.div
        variants={cardVariants}
        className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 text-white mt-8 overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">
              Unlock Advanced Analytics
            </h2>
            <p className="opacity-90 max-w-md">
              Upgrade to premium to unlock customer segmentation, predictive
              analytics, and custom reporting.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 font-medium py-2 px-6 rounded-lg hover:bg-gray-100 transition-colors shadow-lg"
          >
            Upgrade Now
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

export default Analytics;
