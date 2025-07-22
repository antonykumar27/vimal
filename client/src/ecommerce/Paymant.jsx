import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../middlewares/AuthContext";
import {
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import {
  useCreateProcessPaymentMutation,
  useCreateProductOrderMutation,
} from "../../store/api/ProductAdminApi";
import {
  FaLock,
  FaSpinner,
  FaCheckCircle,
  FaCreditCard,
  FaExclamationTriangle,
} from "react-icons/fa";
import { motion } from "framer-motion";

const Payment = () => {
  const { user } = useAuth();
  const { state } = useLocation();
  console.log("state", state.orderData);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const [createPayment] = useCreateProcessPaymentMutation();
  const [createOrder] = useCreateProductOrderMutation();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState(null);
  const [cardComplete, setCardComplete] = useState({
    cardNumber: false,
    cardExpiry: false,
    cardCvc: false,
  });

  const allData = state.orderData;
  console.log("allData", allData);
  // Validate location state
  if (!allData) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md bg-white rounded-xl shadow-lg p-8 text-center">
          <FaExclamationTriangle className="text-yellow-500 text-5xl mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Order Information Missing
          </h1>
          <p className="text-gray-600 mb-6">
            It seems your order details couldn't be found. Please return to your
            cart and try again.
          </p>
          <button
            onClick={() => navigate("/cart")}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Return to Cart
          </button>
        </div>
      </div>
    );
  }

  const { order } = state;
  const { shippingInfo, totalPrice } = allData;
  console.log("shippingInfo", shippingInfo);
  console.log("totalPrice", totalPrice);
  // Prepare payment data

  // Handle card element changes
  const handleCardChange = (elementType) => (event) => {
    setCardComplete({
      ...cardComplete,
      [elementType]: event.complete,
    });
  };

  // Check if form is complete
  const isFormComplete = Object.values(cardComplete).every(Boolean);
  const handlePayment = async () => {
    setIsProcessing(true);
    setPaymentError(null);

    if (!stripe || !elements) {
      setPaymentError("Stripe is not initialized");
      setIsProcessing(false);
      return;
    }

    try {
      // Step 1: Create PaymentIntent
      const res = await createPayment({ amount: totalPrice }).unwrap();
      const clientSecret = res.client_secret;

      // Step 2: Confirm card payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: "Vimal Kumar",
            email: "vimal@example.com",
            address: {
              line1: "Karumballikara",
              city: "Trivandrum",
              postal_code: "695521",
              country: "IN",
            },
          },
        },
      });

      if (result.error) {
        setPaymentError(result.error.message);
        setIsProcessing(false);
      } else if (result.paymentIntent.status === "succeeded") {
        // ✅ Now create orderData after result is available
        const orderData = {
          shippingInfo: {
            address: allData.shippingInfo.address,
            city: allData.shippingInfo.city,
            postalCode: allData.shippingInfo.postalCode,
            phoneNo: allData.shippingInfo.phoneNo,
            country: allData.shippingInfo.country,
          },
          orderItems: allData?.orderItems.map((item) => ({
            name: item.name,
            quantity: item.quantity,
            image: item.image,
            price: item.price,
            productId: item.productId,
          })),
          paymentInfo: {
            id: result.paymentIntent.id,
            status: result.paymentIntent.status,
          },
          itemsPrice: allData.itemsPrice,
          taxPrice: allData.taxPrice,
          shippingPrice: allData.shippingPrice,
          totalPrice: allData.totalPrice,
        };

        // Step 3: Create order in backend
        const response = await createOrder(orderData).unwrap();

        // Step 4: Navigate to success page
        navigate("/payment-success", {
          state: {
            orderId: result.paymentIntent.id,
            amount: totalPrice,
            response,
          },
        });
      }
    } catch (err) {
      console.error("Payment error:", err);
      setPaymentError("Payment failed. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Custom styling for Stripe elements
  const stripeElementStyle = {
    base: {
      fontSize: "16px",
      color: "#374151",
      "::placeholder": {
        color: "#9CA3AF",
      },
    },
    invalid: {
      color: "#EF4444",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Secure Payment
          </h1>
          <p className="text-gray-600">
            Complete your purchase with our secure payment system
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-indigo-600 to-purple-600">
              <h2 className="text-xl font-bold text-white">Order Summary</h2>
            </div>

            <div className="p-6">
              <h3 className="font-bold text-gray-800 mb-3">
                Shipping Information
              </h3>
              <div className="text-gray-700 space-y-2 mb-6">
                <p>{user?.name}</p>
                <p>{shippingInfo.address}</p>
                <p>
                  {shippingInfo.city}, {shippingInfo.state}{" "}
                  {shippingInfo.postalCode}
                </p>
                <p>{shippingInfo.country}</p>
                <p>Phone: {shippingInfo.phoneNo}</p>
              </div>

              <h3 className="font-bold text-gray-800 mb-3">Order Details</h3>
              <div className="space-y-4">
                {allData.orderItems.map((item) => (
                  <div key={item.productId} className="flex items-center gap-4">
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 overflow-hidden">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-gray-600 text-sm">
                        ₹{item.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                    <div className="font-medium">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Items Total</span>
                  <span className="font-medium">
                    ₹{allData.itemsPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">
                    ₹{allData.taxPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">
                    ₹{allData.shippingPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between pt-3 border-t border-gray-200 font-bold text-xl">
                  <span>Total</span>
                  <span className="text-indigo-600">
                    ₹{allData.totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Payment Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <FaCreditCard className="text-indigo-600" /> Payment Details
              </h2>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Card Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaCreditCard className="text-gray-400" />
                  </div>
                  <CardNumberElement
                    options={{ style: stripeElementStyle }}
                    onChange={handleCardChange("cardNumber")}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expiration Date
                  </label>
                  <CardExpiryElement
                    options={{ style: stripeElementStyle }}
                    onChange={handleCardChange("cardExpiry")}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    CVC
                  </label>
                  <CardCvcElement
                    options={{ style: stripeElementStyle }}
                    onChange={handleCardChange("cardCvc")}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500"
                  />
                </div>
              </div>

              {paymentError && (
                <div className="mb-6 p-3 bg-red-50 rounded-lg text-red-700 text-sm">
                  {paymentError}
                </div>
              )}

              <button
                onClick={() => {
                  console.log("Button clicked");
                  handlePayment();
                }}
                disabled={isProcessing || !isFormComplete}
                className="w-full py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center disabled:opacity-75"
              >
                {isProcessing ? (
                  <>
                    <FaSpinner className="animate-spin mr-2" /> Processing
                    Payment...
                  </>
                ) : (
                  <>
                    <FaLock className="mr-2" />
                    Pay ₹{allData.totalPrice?.toFixed(2)}
                  </>
                )}
              </button>

              <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                <FaLock className="mr-2 text-green-500" />
                <span>Your payment is secured with 256-bit SSL encryption</span>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 bg-gradient-to-r from-green-50 to-teal-50 rounded-xl p-6 border border-green-200"
        >
          <div className="flex flex-col md:flex-row items-center">
            <FaCheckCircle className="text-green-500 text-3xl mb-4 md:mb-0 md:mr-4" />
            <div>
              <h3 className="font-bold text-green-800 mb-1">
                100% Secure Payment
              </h3>
              <p className="text-gray-700">
                We use Stripe for secure payments. Your card details are
                encrypted and never stored on our servers. All transactions are
                PCI compliant.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Payment;
