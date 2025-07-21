// components/UserSideBar.jsx
import React, { useState } from "react";
import {
  X,
  Home,
  PlusSquare,
  ShoppingBag,
  Settings,
  User,
  LogOut,
  BarChart,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../middlewares/AuthContext";

const UserSideBar = ({ open, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/");
    onClose();
  };

  return (
    <>
      {/* Backdrop overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-rose-900 to-rose-800 text-white shadow-2xl z-50 transform ${
          open ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b border-rose-700">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <BarChart size={20} />
                <span>Admin Panel</span>
              </h2>
              <button
                onClick={onClose}
                className="p-1 rounded-full hover:bg-rose-700 transition"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="h-12 w-12 rounded-full bg-white flex items-center justify-center shadow-inner">
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt="Profile"
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-rose-700 font-bold text-xl">
                      {user?.name?.charAt(0) || "A"}
                    </span>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-rose-800"></div>
              </div>
              <div>
                <p className="font-medium">{user?.name || "Admin User"}</p>
                <p className="text-xs text-rose-200 truncate">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 flex flex-col p-3 gap-1 mt-2">
            <Link
              to="/ecomerceloginHome"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeLink === "dashboard"
                  ? "bg-white/20 backdrop-blur-sm"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setActiveLink("dashboard")}
            >
              {/* <LayoutDashboard size={18} /> */}
              <span>Dashboard</span>
            </Link>

            <Link
              to="/ecomerceloginHome/productCreate"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeLink === "create"
                  ? "bg-white/20 backdrop-blur-sm"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setActiveLink("create")}
            >
              <PlusSquare size={18} />
              <span>Create Product</span>
            </Link>

            <Link
              to="/ecomerceloginHome/products"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeLink === "products"
                  ? "bg-white/20 backdrop-blur-sm"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setActiveLink("products")}
            >
              <ShoppingBag size={18} />
              <span>Manage Products</span>
            </Link>

            <Link
              to="/profile"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeLink === "profile"
                  ? "bg-white/20 backdrop-blur-sm"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setActiveLink("profile")}
            >
              <User size={18} />
              <span>My Profile</span>
            </Link>

            <Link
              to="/settings"
              className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
                activeLink === "settings"
                  ? "bg-white/20 backdrop-blur-sm"
                  : "hover:bg-white/10"
              }`}
              onClick={() => setActiveLink("settings")}
            >
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </nav>

          <div className="p-3 border-t border-rose-700">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full p-3 rounded-lg text-rose-200 hover:bg-white/10 hover:text-white transition-colors"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserSideBar;
