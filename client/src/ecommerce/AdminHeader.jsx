import React from "react";
import { AlignJustify, LogOut } from "lucide-react";
import { FiBell } from "react-icons/fi";
import { useAuth } from "../middlewares/AuthContext";
import { useNavigate } from "react-router-dom";

function AdminHeader({ setOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async (e) => {
    e.preventDefault();
    logout();
    navigate("/");
  };

  const onCreateProduct = async (e) => {
    navigate("/ecomerceloginHome/productCreate");
  };

  return (
    <header className="bg-white shadow-sm border-b">
      {/* Top section */}
      <div className="flex items-center justify-between px-4 py-3">
        <button
          onClick={() => setOpen(true)}
          className="lg:hidden sm:block p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition"
        >
          <AlignJustify />
          <span className="sr-only">Toggle Menu</span>
        </button>

        <div className="flex flex-1 justify-end gap-2">
          <button
            onClick={onCreateProduct}
            className="bg-rose-700 hover:bg-rose-800 text-white font-medium px-4 py-2 rounded-md transition shadow-sm"
          >
            + Create Product
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium bg-gray-100 hover:bg-gray-200 transition shadow-sm"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>

      {/* Bottom section */}
      <div className="flex justify-between items-center px-4 pb-3">
        <h1 className="text-xl font-bold text-rose-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <button className="text-gray-500 hover:text-rose-700 transition relative">
              <FiBell className="text-xl" />
              <span className="absolute top-0 right-0 h-2 w-2 bg-rose-600 rounded-full"></span>
            </button>
          </div>
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center">
              <span className="text-rose-700 font-bold">A</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;
