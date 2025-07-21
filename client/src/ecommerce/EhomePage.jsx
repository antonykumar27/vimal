import { useState } from "react";
import {
  useLoginMutation,
  usePostUserMutation,
} from "../store/api/CommonUserApi";
import { useNavigate } from "react-router-dom";

const EhomePage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState([]);

  const [login] = useLoginMutation();
  const [signup] = usePostUserMutation();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = [];
    if (!formData.email.includes("@")) newErrors.push("Invalid email");
    if (formData.password.length < 6)
      newErrors.push("Password must be at least 6 characters");
    if (!isLogin && formData.name.length < 3)
      newErrors.push("Name must be at least 3 characters");

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    try {
      if (isLogin) {
        await login({
          email: formData.email,
          password: formData.password,
        }).unwrap();
        // Handle successful login (e.g., redirect)
        Navigate("/ecomerceloginHome");
      } else {
        await signup(formData).unwrap();
        // Handle successful signup (e.g., show success message)
      }
    } catch (err) {
      setErrors(["Authentication failed. Please try again."]);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-100 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Toggle */}
          <div className="flex bg-gray-50">
            <button
              className={`flex-1 py-4 font-medium transition-all duration-300 ${
                isLogin
                  ? "bg-white text-indigo-600 shadow-md rounded-tl-2xl"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-4 font-medium transition-all duration-300 ${
                !isLogin
                  ? "bg-white text-indigo-600 shadow-md rounded-tr-2xl"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          {/* Form Container */}
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
                {errors.map((error, i) => (
                  <p key={i} className="text-sm">
                    • {error}
                  </p>
                ))}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {!isLogin && (
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
              )}

              <div className="mb-4">
                <label className="block text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                  placeholder="hello@example.com"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300 active:scale-95"
              >
                {isLogin ? "Login" : "Sign Up"}
              </button>
            </form>

            <div className="mt-6 text-center">
              <a
                href="#"
                className="text-indigo-600 hover:text-indigo-800 font-medium text-sm transition-colors"
              >
                {isLogin ? "Forgot Password?" : "Already have an account?"}
              </a>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-20 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-10 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      </div>
    </div>
  );
};

export default EhomePage;
