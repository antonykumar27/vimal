// export default AuthContext;
import React, { createContext, useState, useEffect, useContext } from "react";

// Create context
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch data from localStorage when the app is first loaded
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData)); // Parse user data from localStorage
    }

    setLoading(false); // After checking localStorage, set loading to false
  }, []);

  const login = (userData) => {
    setIsAuthenticated(true);

    // If previous user exists, merge with the new one
    setUser((prevUser) => {
      const updatedUser = { ...(prevUser || {}), ...userData };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    });

    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user"); // Remove user data from localStorage
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to access authentication context
export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;
