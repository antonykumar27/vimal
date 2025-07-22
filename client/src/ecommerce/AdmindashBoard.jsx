// // AdminDashboard.jsx (Example page)
// import React from "react";
// import { FiBox } from "react-icons/fi";
// import ProductDisplay from "./ProductDisplay";

// function AdminDashboard() {
//   return (
//     <div className="animate-fadeIn">
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//         {[1, 2, 3, 4].map((item) => (
//           <div
//             key={item}
//             className="bg-white rounded-xl shadow-md p-6 border border-rose-100 transform transition-transform hover:scale-[1.02]"
//           >
//             <div className="flex justify-between items-center ">
//               <div>
//                 <p className="text-gray-500">Total Products</p>
//                 <h3 className="text-2xl font-bold text-rose-800">1,248</h3>
//               </div>
//               <div className="bg-rose-100 p-3 rounded-full">
//                 <FiBox className="text-rose-700 text-xl" />
//               </div>
//             </div>
//             <div className="mt-4">
//               <div className="h-2 bg-rose-50 rounded-full overflow-hidden">
//                 <div className="h-full bg-rose-500 w-3/4"></div>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="bg-white rounded-xl shadow-md p-6  w-full">
//         <ProductDisplay />
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;
// src/components/DashboardContent.jsx
import React from "react";
import { useGetAdminBaseDetailsQuery } from "../../store/api/ProductAdminApi";
import {
  FaUsers,
  FaDollarSign,
  FaShoppingBag,
  FaBox,
  FaChartLine,
  FaShoppingCart,
  FaUserPlus,
  FaCreditCard,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const DashboardContent = () => {
  const { data, isLoading, isError } = useGetAdminBaseDetailsQuery();

  // Format currency values
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Format large numbers
  const formatNumber = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value;
  };

  // Metrics data
  const metrics = [
    {
      title: "Total Customers",
      value: formatNumber(data?.stats.totalCustomers || 0),
      change: "+12.5%",
      icon: <FaUsers className="text-blue-500" />,
      color: "from-blue-50 to-blue-100",
      border: "border-blue-200",
    },
    {
      title: "Total Revenue",
      value: formatCurrency(data?.stats.totalRevenue || 0),
      change: "+18.3%",
      icon: <FaDollarSign className="text-green-500" />,
      color: "from-green-50 to-green-100",
      border: "border-green-200",
    },
    {
      title: "Total Orders",
      value: formatNumber(data?.stats.totalOrders || 0),
      change: "+8.2%",
      icon: <FaShoppingBag className="text-purple-500" />,
      color: "from-purple-50 to-purple-100",
      border: "border-purple-200",
    },
    {
      title: "Avg. Order Value",
      value: formatCurrency(
        data?.stats?.totalRevenue && data?.stats?.totalOrders
          ? data.stats.totalRevenue / data.stats.totalOrders
          : 0
      ),
      change: "+4.3%",
      icon: <FaChartLine className="text-yellow-500" />,
      color: "from-yellow-50 to-yellow-100",
      border: "border-yellow-200",
    },
    {
      title: "Products Sold",
      value: formatNumber(data?.stats.totalSold || 0),
      change: "-1.2%",
      icon: <FaBox className="text-red-500" />,
      color: "from-red-50 to-red-100",
      border: "border-red-200",
    },
  ];

  // Recent activities
  const activities = [
    {
      user: "Jane Cooper",
      action: "placed an order",
      time: "2 min ago",
      icon: <FaShoppingCart className="text-blue-500" />,
    },
    {
      user: "John Doe",
      action: "registered as a new customer",
      time: "15 min ago",
      icon: <FaUserPlus className="text-green-500" />,
    },
    {
      user: "Robert Fox",
      action: "completed payment of $320",
      time: "45 min ago",
      icon: <FaCreditCard className="text-purple-500" />,
    },
    {
      user: "System",
      action: "5 products are low in stock",
      time: "1 hour ago",
      icon: <FaExclamationTriangle className="text-red-500" />,
    },
  ];

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  if (isError)
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <h3 className="text-lg font-medium text-red-800">Error loading data</h3>
        <p className="text-red-600">Please try again later</p>
      </div>
    );

  return (
    <div className="bg-white rounded-xl shadow-md p-4 md:p-6">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 md:mb-8">
        {metrics.map((metric, index) => (
          <motion.div
            key={index}
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className={`bg-gradient-to-br ${metric.color} ${metric.border} rounded-xl p-4 md:p-5 
              shadow-sm hover:shadow-md transition-shadow duration-300`}
          >
            <div className="flex items-center mb-2">
              <div className="p-2 rounded-lg bg-white shadow-sm mr-3">
                {metric.icon}
              </div>
              <h3 className="text-gray-500 text-sm font-medium">
                {metric.title}
              </h3>
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-xl md:text-2xl font-bold text-gray-800">
                {metric.value}
              </span>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  metric.change.startsWith("+")
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {metric.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity */}
      <motion.div
        variants={cardVariants}
        transition={{ duration: 0.4 }}
        className="bg-gray-50 rounded-xl p-5 md:p-6 mb-6 md:mb-8"
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FaBox className="mr-2 text-indigo-500" /> Recent Activity
        </h2>
        <ul className="space-y-3">
          {activities.map((activity, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center p-3 bg-white rounded-lg shadow-sm hover:shadow transition-shadow"
            >
              <div className="p-2 rounded-lg bg-gray-100 mr-3">
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
              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                {activity.time}
              </span>
            </motion.li>
          ))}
        </ul>
      </motion.div>

      {/* Upgrade Banner */}
      <motion.div
        variants={cardVariants}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-5 md:p-6 text-white overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-bold mb-2">Get Pro Features</h2>
            <p className="opacity-90 max-w-md">
              Upgrade to premium to unlock advanced analytics, custom reports,
              and priority support.
            </p>
          </div>
          <button className="bg-white text-indigo-600 font-medium py-2 px-5 rounded-lg hover:bg-gray-100 transition-colors shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform">
            Upgrade Now
          </button>
        </div>
        <div className="absolute top-0 right-0 h-full w-1/3 bg-gradient-to-l from-white/10 to-transparent"></div>
      </motion.div>
    </div>
  );
};

export default DashboardContent;
