import React, { useEffect, useState } from "react";
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
import UserOrderCreate from "./ecommerce/UserOrderCreate";
import GetOrderedList from "./ecommerce/GetOrderedList";
import { SocketProvider } from "./middlewares/Socket";
import Payment from "./ecommerce/Paymant";
import { useGetsendStripeApiQuery } from "../store/api/ProductAdminApi";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import OrderSuccess from "./ecommerce/OrderSuccess";
import CashOnDeliveryOrderSuccess from "./ecommerce/CashOnDeliveryOrderSuccess";
import MyOrderStatus from "./ecommerce/MyOrderStatus";
import AllOrders from "./ecommerce/AllOrders";
import AllCustomers from "./ecommerce/AllCustomers";
import AllReviews from "./ecommerce/AllReviews";
import AllMessage from "./ecommerce/AllMessage";
import Analytics from "./ecommerce/Analytics";
import Discounts from "./ecommerce/Discounts";
import { Settings } from "lucide-react";
function App() {
  const { data, error, isLoading } = useGetsendStripeApiQuery();
  console.log("data", data);
  const [stripeApiKey, setStripeApiKey] = useState("");
  useEffect(() => {
    if (stripeApiKey) {
      console.log("Stripe Key Loaded:", stripeApiKey);
    }
  }, [stripeApiKey]);

  useEffect(() => {
    if (data?.stripeApiKey) {
      setStripeApiKey(data.stripeApiKey);
    }
  }, [data]);
  return (
    <AuthProvider>
      <SocketProvider>
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="home" element={<Homes />} />
          <Route path="product/:id" element={<UserProductDisplay />} />
          <Route path="orderCreate" element={<UserOrderCreate />} />
          <Route path="getcartlist" element={<GetOrderedList />} />
          <Route path="payment-success" element={<OrderSuccess />} />
          <Route path="myorderstatus" element={<MyOrderStatus />} />

          <Route
            path="order/success"
            element={<CashOnDeliveryOrderSuccess />}
          />
          {stripeApiKey && (
            <Route
              path="payment"
              element={
                <ProtectedRoute>
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <Payment />
                  </Elements>
                </ProtectedRoute>
              }
            />
          )}
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
              <Route path="orders" element={<AllOrders />} />
              <Route path="customers" element={<AllCustomers />} />
              <Route path="reviews" element={<AllReviews />} />
              <Route path="messages" element={<AllMessage />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="discounts" element={<Discounts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="productCreate" element={<ProductCreateModal />} />

              <Route path="product/:id" element={<SingleProductUpdate />} />
              <Route
                path="productupdate/:id"
                element={<AdminProductUpdate />}
              />
            </Route>
            {/* <Route path="admindashboard" element={<AdminDashboard />} /> */}
          </Route>
        </Routes>
        <ToastContainer />
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
