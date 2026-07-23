import api from "../api/axiosInstance";

export const getVehicles = () => api.get("/vehicles");
export const searchVehicles = (params) =>
  api.get("/vehicles/search", { params });
export const createVehicle = (data) => api.post("/vehicles", data);
export const updateVehicle = (id, data) => api.put(`/vehicles/${id}`, data);
export const deleteVehicle = (id) => api.delete(`/vehicles/${id}`);
export const purchaseVehicle = (id) => api.post(`/vehicles/${id}/purchase`);
export const restockVehicle = (id, quantity) =>
  api.post(`/vehicles/${id}/restock`, { quantity });
