import { createContext, useContext, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const registerUser = async (userData) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.registerUser(userData);
      setUser(res.data.data);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (credentials) => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await authService.loginUser(credentials);
      setUser(res.data.data);
      localStorage.setItem("token", res.data.token);
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || "Login failed";
      setError(message);
      return { success: false, error: message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, error, registerUser, loginUser, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);