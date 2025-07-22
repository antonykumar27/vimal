// src/components/AdminSidebar.jsx
import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FiX,
  FiMenu,
  FiHome,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiShoppingCart,
  FiAlertCircle,
  FiBarChart2,
  FiMessageSquare,
  FiStar,
  FiDollarSign,
} from "react-icons/fi";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activePath, setActivePath] = useState("");
  const [notificationCounts, setNotificationCounts] = useState({
    orders: 12,
    products: 3,
    customers: 7,
  });
  const location = useLocation();

  // Simulate real-time notifications
  useEffect(() => {
    setActivePath(location.pathname.split("/").pop());

    const interval = setInterval(() => {
      setNotificationCounts((prev) => ({
        orders: prev.orders + Math.floor(Math.random() * 3),
        products: Math.max(0, prev.products - 1),
        customers: prev.customers + Math.floor(Math.random() * 2),
      }));
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [location]);

  // Auto-close sidebar on mobile when route changes
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setIsOpen(false);
    }
  }, [location]);

  const navItems = [
    {
      path: "/ecomerceloginHome",
      name: "Dashboard",
      icon: <FiHome className="text-xl" />,
      badge: 0,
    },
    {
      path: "products",
      name: "Products",
      icon: <FiBox className="text-xl" />,
      badge: notificationCounts.products,
    },
    {
      path: "orders",
      name: "Orders",
      icon: <FiShoppingBag className="text-xl" />,
      badge: notificationCounts.orders,
    },
    {
      path: "customers",
      name: "Customers",
      icon: <FiUsers className="text-xl" />,
      badge: notificationCounts.customers,
    },
    {
      path: "reviews",
      name: "Reviews",
      icon: <FiStar className="text-xl" />,
      badge: 24,
    },
    {
      path: "messages",
      name: "Messages",
      icon: <FiMessageSquare className="text-xl" />,
      badge: 5,
    },
    {
      path: "analytics",
      name: "Analytics",
      icon: <FiBarChart2 className="text-xl" />,
      badge: 0,
    },
    {
      path: "discounts",
      name: "Discounts",
      icon: <FiDollarSign className="text-xl" />,
      badge: 2,
    },
    {
      path: "settings",
      name: "Settings",
      icon: <FiSettings className="text-xl" />,
      badge: 0,
    },
  ];

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-rose-600 text-white p-2 rounded-full shadow-lg hover:bg-rose-700 transition-all duration-300 group"
      >
        {isOpen ? (
          <FiX className="transform group-hover:rotate-90 transition-transform duration-300" />
        ) : (
          <FiMenu className="transform group-hover:rotate-12 transition-transform duration-300" />
        )}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-gradient-to-b from-rose-900 to-rose-700 text-white w-64 transform transition-all duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${collapsed ? "lg:w-20" : "lg:w-64"}`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div
            className={`p-5 border-b border-rose-800 flex items-center ${
              collapsed ? "justify-center" : "justify-between"
            }`}
          >
            {!collapsed && (
              <div className="flex items-center space-x-3">
                <div className="bg-white text-rose-700 p-2 rounded-lg">
                  <FiShoppingCart className="text-2xl" />
                </div>
                <h1 className="text-xl font-bold font-serif">Saree Palace</h1>
              </div>
            )}

            {collapsed && (
              <div className="bg-white text-rose-700 p-2 rounded-lg">
                <FiShoppingCart className="text-2xl" />
              </div>
            )}

            <button
              onClick={toggleCollapse}
              className="hidden lg:block text-rose-200 hover:text-white transition-colors"
            >
              {collapsed ? (
                <FiMenu className="text-xl transform hover:rotate-12 transition-transform" />
              ) : (
                <FiX className="text-xl transform hover:rotate-90 transition-transform" />
              )}
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4 overflow-y-auto">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 relative overflow-hidden group ${
                        isActive || activePath === item.path
                          ? "bg-rose-100 text-rose-900 font-medium"
                          : "hover:bg-rose-800 hover:bg-opacity-50"
                      } ${collapsed ? "justify-center" : ""}`
                    }
                  >
                    {item.icon}

                    {!collapsed && (
                      <>
                        <span>{item.name}</span>
                        {item.badge > 0 && (
                          <span className="absolute right-3 bg-rose-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                            {item.badge}
                          </span>
                        )}
                      </>
                    )}

                    {collapsed && item.badge > 0 && (
                      <span className="absolute top-1 right-1 bg-rose-600 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-pulse">
                        {item.badge}
                      </span>
                    )}

                    {!collapsed && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                    )}
                  </NavLink>
                </li>
              ))}

              {/* Out of Stock Section */}
              <li>
                <div
                  className={`flex items-center p-3 rounded-lg bg-rose-800/50 mt-6 ${
                    collapsed ? "justify-center" : "justify-between"
                  }`}
                >
                  <div className="flex items-center space-x-3 text-amber-300">
                    <FiAlertCircle className="text-xl" />
                    {!collapsed && <span>Low Stock Items</span>}
                  </div>
                  {!collapsed && (
                    <span className="bg-amber-500 text-white text-xs font-bold rounded-full px-2 py-1">
                      8 items
                    </span>
                  )}
                </div>
              </li>
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-rose-800">
            <button
              className={`flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-rose-800 transition-colors duration-300 group ${
                collapsed ? "justify-center" : ""
              }`}
            >
              <FiLogOut className="text-xl transform group-hover:-translate-x-1 transition-transform" />
              {!collapsed && (
                <span className="transform group-hover:translate-x-1 transition-transform">
                  Logout
                </span>
              )}
            </button>

            {!collapsed && (
              <div className="mt-4 pt-4 border-t border-rose-800/50 text-center">
                <p className="text-rose-200 text-sm">Admin Panel v2.4</p>
                <p className="text-rose-300/50 text-xs mt-1">
                  © 2023 Saree Palace
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
