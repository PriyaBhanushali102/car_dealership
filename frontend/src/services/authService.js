import api from "../api/axiosInstance";
export const registerUser = async (userData) => {
  return await api.post("/auth/register", userData);
};
export const loginUser = async (credentials) => {
  return await api.post("/auth/login", credentials);
};
