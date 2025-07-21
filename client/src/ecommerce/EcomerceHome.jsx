import React, { useState } from "react";
import {
  FiShoppingBag,
  FiUsers,
  FiBarChart,
  FiSettings,
  FiBell,
  FiSearch,
  FiMenu,
  FiX,
} from "react-icons/fi";

import { FaRupeeSign, FaStarHalfAlt, FaStar, FaRegStar } from "react-icons/fa";

import { BsBoxSeam, BsCurrencyRupee } from "react-icons/bs";

import { GiClothes } from "react-icons/gi";
const EcommerceDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Toggle sidebar on mobile
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-indigo-600 text-white shadow-lg"
        >
          {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white transform transition-transform duration-300 ease-in-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-center p-6 border-b border-indigo-800">
          <div className="flex items-center space-x-3">
            <GiClothes className="text-pink-400 text-3xl" />
            <h1 className="text-2xl font-bold">
              Saree<span className="text-pink-400">Bazaar</span>
            </h1>
          </div>
        </div>

        <nav className="p-4 mt-6">
          <ul className="space-y-2">
            {[
              {
                id: "dashboard",
                icon: <FiBarChart size={20} />,
                label: "Dashboard",
              },
              {
                id: "products",
                icon: <GiClothes size={20} />,
                label: "Products",
              },
              {
                id: "orders",
                icon: <FiShoppingBag size={20} />,
                label: "Orders",
              },
              {
                id: "customers",
                icon: <FiUsers size={20} />,
                label: "Customers",
              },
              {
                id: "inventory",
                icon: <BsBoxSeam size={20} />,
                label: "Inventory",
              },
              {
                id: "settings",
                icon: <FiSettings size={20} />,
                label: "Settings",
              },
            ].map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === item.id
                      ? "bg-indigo-700 text-white shadow-md"
                      : "text-indigo-200 hover:bg-indigo-800"
                  }`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-indigo-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
              <span className="font-bold">AK</span>
            </div>
            <div>
              <p className="font-medium">Akshay Kumar</p>
              <p className="text-xs text-indigo-300">Admin</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-64 transition-all duration-300">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="relative flex-1 max-w-xl">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search products, orders, customers..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
              />
            </div>

            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-full hover:bg-gray-100 relative">
                <FiBell className="text-gray-600" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-2 border-indigo-300">
                <span className="font-bold text-indigo-700">AK</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 md:p-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value="₹2,45,899"
              change="+12.5%"
              icon={<FaRupeeSign className="text-green-500" />}
              color="bg-green-100"
            />
            <StatCard
              title="Orders"
              value="1,248"
              change="+8.2%"
              icon={<FiShoppingBag className="text-blue-500" />}
              color="bg-blue-100"
            />
            <StatCard
              title="Customers"
              value="8,452"
              change="+5.7%"
              icon={<FiUsers className="text-purple-500" />}
              color="bg-purple-100"
            />
            <StatCard
              title="Inventory"
              value="1,287"
              change="-2.3%"
              icon={<BsBoxSeam className="text-amber-500" />}
              color="bg-amber-100"
            />
          </div>

          {/* Charts and Tables */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Revenue Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  Revenue Overview
                </h2>
                <div className="flex space-x-2">
                  <button className="px-3 py-1 text-sm rounded-lg bg-indigo-50 text-indigo-600">
                    Monthly
                  </button>
                  <button className="px-3 py-1 text-sm rounded-lg text-gray-500 hover:bg-gray-100">
                    Quarterly
                  </button>
                  <button className="px-3 py-1 text-sm rounded-lg text-gray-500 hover:bg-gray-100">
                    Yearly
                  </button>
                </div>
              </div>

              {/* Chart Placeholder */}
              <div className="h-64 flex items-end justify-between pt-4">
                {[60, 80, 45, 70, 90, 65, 85, 75].map((height, index) => (
                  <div
                    key={index}
                    className="flex flex-col items-center flex-1 px-1"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg transition-all hover:opacity-75"
                      style={{ height: `${height}%` }}
                    ></div>
                    <span className="text-xs text-gray-500 mt-2">
                      {
                        [
                          "Jan",
                          "Feb",
                          "Mar",
                          "Apr",
                          "May",
                          "Jun",
                          "Jul",
                          "Aug",
                        ][index]
                      }
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                Top Selling Sarees
              </h2>
              <div className="space-y-4">
                {topSarees.map((saree, index) => (
                  <div key={index} className="flex items-center">
                    <div className="w-16 h-16 rounded-lg bg-gray-200 border-2 border-dashed flex-shrink-0"></div>
                    <div className="ml-4 flex-1">
                      <h3 className="font-medium text-gray-800">
                        {saree.name}
                      </h3>
                      <div className="flex items-center mt-1">
                        {[...Array(5)].map((_, i) => (
                          <span key={i}>
                            {i < Math.floor(saree.rating) ? (
                              <FaStar className="text-yellow-400 inline text-sm" />
                            ) : i === Math.floor(saree.rating) &&
                              saree.rating % 1 >= 0.5 ? (
                              <FaStarHalfAlt className="text-yellow-400 inline text-sm" />
                            ) : (
                              <FaRegStar className="text-yellow-400 inline text-sm" />
                            )}
                          </span>
                        ))}
                        <span className="text-xs text-gray-500 ml-1">
                          ({saree.rating})
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold flex items-center justify-end">
                        <BsCurrencyRupee className="inline mr-1" size={12} />
                        {saree.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{saree.sold} sold</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 overflow-x-auto">
            <h2 className="text-lg font-semibold text-gray-800 mb-6">
              Recent Orders
            </h2>
            <table className="w-full min-w-full">
              <thead>
                <tr className="text-left text-gray-500 text-sm border-b">
                  <th className="pb-3 font-medium">Order ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 text-indigo-600 font-medium">
                      #{order.id}
                    </td>
                    <td className="py-4">{order.customer}</td>
                    <td className="py-4 text-gray-500">{order.date}</td>
                    <td className="py-4 font-medium flex items-center">
                      <BsCurrencyRupee className="inline mr-1" size={12} />
                      {order.amount.toLocaleString()}
                    </td>
                    <td className="py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-800"
                            : order.status === "Processing"
                            ? "bg-blue-100 text-blue-800"
                            : order.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ title, value, change, icon, color }) => {
  const isPositive = change.startsWith("+");

  return (
    <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-100 transition-all hover:shadow-md">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm">{title}</p>
          <h3 className="text-2xl font-bold mt-1 flex items-center">{value}</h3>
        </div>
        <div
          className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}
        >
          {React.cloneElement(icon, { size: 20 })}
        </div>
      </div>
      <p
        className={`mt-3 text-sm flex items-center ${
          isPositive ? "text-green-600" : "text-red-600"
        }`}
      >
        <span>{change}</span>
        <span className="ml-1">from last month</span>
      </p>
    </div>
  );
};

// Dummy data
const topSarees = [
  { name: "Banarasi Silk Saree", rating: 4.8, price: 5899, sold: 142 },
  { name: "Kanjivaram Cotton", rating: 4.6, price: 4599, sold: 128 },
  { name: "Chanderi Art Silk", rating: 4.9, price: 3899, sold: 115 },
  { name: "Bandhani Printed", rating: 4.5, price: 3299, sold: 98 },
];

const recentOrders = [
  {
    id: "ORD-7841",
    customer: "Priya Sharma",
    date: "12 Aug, 2023",
    amount: 5899,
    status: "Delivered",
  },
  {
    id: "ORD-7840",
    customer: "Neha Patel",
    date: "12 Aug, 2023",
    amount: 12499,
    status: "Processing",
  },
  {
    id: "ORD-7839",
    customer: "Ananya Reddy",
    date: "11 Aug, 2023",
    amount: 8599,
    status: "Delivered",
  },
  {
    id: "ORD-7838",
    customer: "Sneha Verma",
    date: "11 Aug, 2023",
    amount: 3299,
    status: "Pending",
  },
  {
    id: "ORD-7837",
    customer: "Divya Singh",
    date: "10 Aug, 2023",
    amount: 6899,
    status: "Delivered",
  },
];

export default EcommerceDashboard;
