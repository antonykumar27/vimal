// // AuthLayout.jsx
// import { useState } from "react";
// import { Outlet } from "react-router-dom";
// import AdminSidebar from "./AdminSidebar";
// import { FiBell } from "react-icons/fi";

// function AuthLayout() {
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   return (
//     <div className="flex h-screen bg-gray-50">
//       <AdminSidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

//       <div className="flex-1 flex flex-col overflow-hidden">
//         {/* Topbar */}

//         {/* Main Content */}
//         <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-gradient-to-br from-rose-50 to-white">
//           <div className="max-w-7xl mx-auto">
//             <Outlet />
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AuthLayout;

import React, { useState } from "react";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "@/ecommerce/AdminHeader";
import { Outlet } from "react-router-dom";
import { useTheme } from "next-themes";

const AuthLayout = () => {
  const { theme } = useTheme();

  return (
    <div className="w-full h-screen flex flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex flex-col w-full">
          <AdminHeader />
          <section
            className={`flex-1 overflow-y-auto overflow-x-hidden ${
              theme === "dark"
                ? "bg-gray-800 text-white"
                : "bg-white text-black"
            }`}
          >
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
