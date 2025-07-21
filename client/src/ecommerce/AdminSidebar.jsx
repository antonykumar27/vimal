// AdminSidebar.jsx
import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  FiX,
  FiMenu,
  FiHome,
  FiBox,
  FiShoppingBag,
  FiUsers,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";

function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    {
      path: "ecomerceloginHome",
      name: "Dashboard",
      icon: <FiHome className="text-xl" />,
    },
    { path: "products", name: "Products", icon: <FiBox className="text-xl" /> },
    {
      path: "orders",
      name: "Orders",
      icon: <FiShoppingBag className="text-xl" />,
    },
    {
      path: "customers",
      name: "Customers",
      icon: <FiUsers className="text-xl" />,
    },
    {
      path: "settings",
      name: "Settings",
      icon: <FiSettings className="text-xl" />,
    },
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-rose-600 text-white p-2 rounded-full shadow-lg"
      >
        {isOpen ? <FiX /> : <FiMenu />}
      </button>

      {/* Sidebar Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 z-40 bg-gradient-to-b from-rose-900 to-rose-700 text-white w-64 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-5 border-b border-rose-800 flex items-center space-x-3">
            <div className="bg-white text-rose-700 p-2 rounded-lg">
              <FiBox className="text-2xl" />
            </div>
            <h1 className="text-xl font-bold font-serif">Saree Palace</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 py-4">
            <ul className="space-y-1 px-3">
              {navItems.map((item) => (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                        isActive
                          ? "bg-rose-100 text-rose-900 font-medium"
                          : "hover:bg-rose-800 hover:bg-opacity-50"
                      }`
                    }
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-rose-800">
            <button className="flex items-center space-x-3 w-full p-3 rounded-lg hover:bg-rose-800 hover:bg-opacity-50">
              <FiLogOut className="text-xl" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminSidebar;
