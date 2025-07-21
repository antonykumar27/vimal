import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Routes, Route } from "react-router-dom";

import { AuthProvider } from "./middlewares/AuthContext";
import Register from "./auth/Register";
import Home from "./home/Home";
import ProtectedRoute from "./middlewares/ProtectRoutes";
import AdminDashboard from "./ecommerce/AdmindashBoard";
import ProductDisplay from "./ecommerce/ProductDisplay";
import ProductCreateModal from "./ecommerce/ProductCreateModal";
import SingleProductUpdate from "./ecommerce/SingleProductUpdate";
import AdminProductUpdate from "./ecommerce/AdminProductUpdate";
import AdminOutlet from "./ecommerce/AdminOutlet";
import AuthLatout from "./ecommerce/AuthLayout";
import Homes from "./ecommerce/Home";
import UserProductDisplay from "./ecommerce/UserProductDisplay";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="home" element={<Homes />} />
        <Route path="product/:id" element={<UserProductDisplay />} />
        <Route
          path="/ecomerceloginHome"
          element={
            <ProtectedRoute>
              <AuthLatout />
            </ProtectedRoute>
          }
        >
          <Route element={<AdminOutlet />}>
            <Route index element={<AdminDashboard />} />
            <Route path="products" element={<ProductDisplay />} />

            <Route path="productCreate" element={<ProductCreateModal />} />

            <Route path="product/:id" element={<SingleProductUpdate />} />
            <Route path="productupdate/:id" element={<AdminProductUpdate />} />
          </Route>
          {/* <Route path="admindashboard" element={<AdminDashboard />} /> */}
        </Route>
      </Routes>
      <ToastContainer />
    </AuthProvider>
  );
}

export default App;
