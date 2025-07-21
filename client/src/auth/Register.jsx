import React, { useState, useEffect, useContext } from "react";
import {
  useCreateRegisterMutation,
  useLoginUserMutation,
} from "../../store/api/AuthUserApi";
import { toast } from "react-toastify";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaSignInAlt,
  FaUserPlus,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import AuthContext from "../middlewares/AuthContext";
function Register() {
  const navigate = useNavigate();
  const { login: setAuthTrue } = useContext(AuthContext);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [createRegister, { isLoading: isRegistering }] =
    useCreateRegisterMutation();
  const [loginUser, { isLoading: isLoggingIn }] = useLoginUserMutation();

  const isLoading = isRegistering || isLoggingIn;

  const toggleMode = () => {
    setIsLoginMode(!isLoginMode);
    setFormData({ name: "", email: "", password: "" });
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!formData.email || !formData.password) {
      toast.error("Email and password are required");
      return;
    }

    if (!isLoginMode && !formData.name) {
      toast.error("Name is required for registration");
      return;
    }

    try {
      if (isLoginMode) {
        const response = await loginUser({
          email: formData.email,
          password: formData.password,
        }).unwrap();

        if (response?.success && response?.user?._id) {
          // Save to state/context
          setAuthTrue({ ...response.user, token: response.token });

          // Save to localStorage
          localStorage.setItem(
            "user",
            JSON.stringify({ ...response.user, token: response.token })
          );

          toast.success("Login successful!");

          // Navigate to home
          navigate("/ecomerceloginHome");
        } else {
          toast.error("Login failed. Invalid credentials.");
        }
      } else {
        const response = await createRegister(formData).unwrap();
        toast.success("Registration successful!");
        console.log("Register Response:", response);

        // Switch to login mode after registration
        setIsLoginMode(true);
      }
    } catch (err) {
      console.error("Auth error:", err);
      toast.error(
        err?.data?.message || "Something went wrong during authentication"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <motion.div
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="p-1 bg-gradient-to-r from-blue-500 to-indigo-600">
            <div className="bg-white p-8 rounded-xl">
              <div className="flex justify-center mb-6">
                <div className="relative">
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16" />
                  <div className="absolute -bottom-2 -right-2 bg-blue-500 rounded-full p-2">
                    {isLoginMode ? (
                      <FaSignInAlt className="text-white text-lg" />
                    ) : (
                      <FaUserPlus className="text-white text-lg" />
                    )}
                  </div>
                </div>
              </div>

              <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
                {isLoginMode ? "Welcome Back" : "Create Account"}
              </h2>
              <p className="text-center text-gray-500 mb-8">
                {isLoginMode
                  ? "Sign in to continue your journey"
                  : "Join us to get started"}
              </p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {!isLoginMode && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="relative"
                  >
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      placeholder="Full Name"
                    />
                  </motion.div>
                )}

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-gray-400" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Email Address"
                  />
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Password"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FaEyeSlash className="text-gray-400 hover:text-gray-600" />
                    ) : (
                      <FaEye className="text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {isLoginMode && (
                  <div className="flex justify-end">
                    <button
                      type="button"
                      className="text-sm text-blue-600 hover:text-blue-800 transition"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                    isLoading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg"
                  }`}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      {isLoginMode ? "Signing In..." : "Creating Account..."}
                    </span>
                  ) : isLoginMode ? (
                    "Sign In"
                  ) : (
                    "Sign Up"
                  )}
                </motion.button>

                <div className="relative flex items-center justify-center my-6">
                  <div className="border-t border-gray-200 w-full"></div>
                  <span className="px-3 bg-white text-gray-500 text-sm absolute">
                    OR
                  </span>
                </div>

                <button
                  type="button"
                  onClick={toggleMode}
                  className="w-full text-center text-blue-600 hover:text-blue-800 font-medium transition flex items-center justify-center"
                >
                  {isLoginMode ? (
                    <>
                      <FaUserPlus className="mr-2" />
                      Create new account
                    </>
                  ) : (
                    <>
                      <FaSignInAlt className="mr-2" />
                      Already have an account? Sign in
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </motion.div>

        <p className="text-center text-gray-500 text-sm mt-6">
          © {new Date().getFullYear()} Your Brand. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
}

export default Register;
