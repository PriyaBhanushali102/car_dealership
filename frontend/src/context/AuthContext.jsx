import { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // starts true for session restore
  const [error, setError] = useState(null);

  // Restore session from localStorage token on mount
  useEffect(() => {
    const restoreSession = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const res = await authService.getMe();
        setUser(res.data.data);
      } catch {
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    restoreSession();
  }, []);

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
      value={{
        user,
        isLoading,
        error,
        registerUser,
        loginUser,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);