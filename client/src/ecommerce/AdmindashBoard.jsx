// AdminDashboard.jsx (Example page)
import React from "react";
import { FiBox } from "react-icons/fi";
import ProductDisplay from "./ProductDisplay";

function AdminDashboard() {
  return (
    <div className="animate-fadeIn">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-white rounded-xl shadow-md p-6 border border-rose-100 transform transition-transform hover:scale-[1.02]"
          >
            <div className="flex justify-between items-center ">
              <div>
                <p className="text-gray-500">Total Products</p>
                <h3 className="text-2xl font-bold text-rose-800">1,248</h3>
              </div>
              <div className="bg-rose-100 p-3 rounded-full">
                <FiBox className="text-rose-700 text-xl" />
              </div>
            </div>
            <div className="mt-4">
              <div className="h-2 bg-rose-50 rounded-full overflow-hidden">
                <div className="h-full bg-rose-500 w-3/4"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl shadow-md p-6  w-full">
        <ProductDisplay />
      </div>
    </div>
  );
}

export default AdminDashboard;
