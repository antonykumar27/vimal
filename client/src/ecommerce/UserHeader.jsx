// components/UserHeader.jsx
import React, { useState, useRef, useEffect } from "react";
import {
  AlignJustify,
  LogOut,
  User,
  Settings,
  ShoppingCart,
  LayoutDashboard,
} from "lucide-react";
import { FiBell } from "react-icons/fi";
import { useAuth } from "../middlewares/AuthContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "./UserSideBar";
import { useSocket } from "../middlewares/Socket";
import { useGetCartQuery } from "../../store/api/ProductAdminApi";

function UserHeader() {
  const [openSidebar, setOpenSidebar] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const profileRef = useRef(null);
  const { socket } = useSocket();
  console.log("cartCount", cartCount);
  // Get cart data from RTK Query
  const { data: cartData, refetch: refetchCart } = useGetCartQuery();

  const handleLogout = (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  // Calculate total cart items count
  const calculateCartCount = (cart) => {
    if (!cart?.items) return 0;
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  };

  // Initialize cart count from RTK Query
  useEffect(() => {
    if (cartData?.cart) {
      setCartCount(calculateCartCount(cartData.cart));
    }
  }, [cartData]);

  useEffect(() => {
    if (!socket) return;

    const handleCartChange = (data) => {
      console.log("🛒 Cart changed (add/update/delete):", data);

      if (data.cart) {
        setCartCount(calculateCartCount(data.cart));
      }

      // Optionally, always refetch the latest cart from server
      refetchCart();
    };

    // Unified handler for any cart mutation
    socket.on("cartUpdated", handleCartChange);
    socket.on("cartdeleted", handleCartChange);

    return () => {
      socket.off("cartUpdated", handleCartChange);
      socket.off("cartdeleted", handleCartChange);
    };
  }, [socket, refetchCart]);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Sidebar open={openSidebar} onClose={() => setOpenSidebar(false)} />

      <header className="bg-gradient-to-r from-violet-900 to-rose-700 text-white shadow-lg sticky top-0 z-40 mb-10">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center">
            <button
              onClick={() => setOpenSidebar(true)}
              className="lg:hidden block p-2 rounded-md bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-all"
            >
              <AlignJustify className="text-white" />
              <span className="sr-only">Toggle Menu</span>
            </button>

            {/* Cart Button with Count Badge */}
            <div className="relative ml-4 flex items-center">
              <button
                onClick={() => navigate("/getcartlist")}
                className="p-2 rounded-full hover:bg-white/20 transition-all relative"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.5 7h13l-1.5-7M7 13h10m-6 6a1 1 0 100 2 1 1 0 000-2zm6 0a1 1 0 100 2 1 1 0 000-2z"
                  />
                </svg>

                {/* Cart Count Badge */}
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-500 rounded-full transform translate-x-1/2 -translate-y-1/2 animate-pulse">
                    {cartCount > 9 ? "9+" : cartCount}
                  </span>
                )}
              </button>
              <button onClick={() => navigate("/myorderstatus")}>
                My Order Status
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 rounded-full hover:bg-white/20 transition">
              <FiBell className="text-xl" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-yellow-400 rounded-full"></span>
            </button>

            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 group"
              >
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-inner">
                    {user?.avatar ? (
                      <img
                        src={user.avatar}
                        alt="Profile"
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <span className="text-rose-700 font-bold text-lg">
                        {user?.name?.charAt(0) || "U"}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                </div>
                <span className="hidden md:inline font-medium">
                  {user?.name || "User"}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl overflow-hidden z-50 border border-rose-100">
                  <div className="p-4 border-b border-rose-100">
                    <p className="font-semibold text-gray-900">
                      {user?.name || "Admin User"}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {user?.email || "admin@example.com"}
                    </p>
                  </div>
                  <div className="py-1">
                    <button
                      onClick={() => navigate("/profile")}
                      className="w-full flex items-center px-4 py-2.5 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <User size={16} className="mr-3" />
                      <span>My Profile</span>
                    </button>
                    <button
                      onClick={() => navigate("/settings")}
                      className="w-full flex items-center px-4 py-2.5 text-left text-gray-700 hover:bg-rose-50 hover:text-rose-700 transition-colors"
                    >
                      <Settings size={16} className="mr-3" />
                      <span>Account Settings</span>
                    </button>
                  </div>
                  <div className="py-1 border-t border-rose-100">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-2.5 text-left text-rose-700 hover:bg-rose-50 transition-colors"
                    >
                      <LogOut size={16} className="mr-3" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
    </>
  );
}

export default UserHeader;
