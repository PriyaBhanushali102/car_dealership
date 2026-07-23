import { createContext, useContext, useState, useCallback } from "react";
import * as vehicleService from "../services/vehicleService";

const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVehicles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await vehicleService.getVehicles();
      setVehicles(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load vehicles");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchVehicles = useCallback(async (params) => {
    setIsLoading(true);
    setError(null);
    try {
      // If no params, fetch all
      const hasParams = Object.values(params).some((v) => v !== "" && v != null);
      const res = hasParams
        ? await vehicleService.searchVehicles(params)
        : await vehicleService.getVehicles();
      setVehicles(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addVehicle = async (data) => {
    const res = await vehicleService.createVehicle(data);
    setVehicles((prev) => [res.data.data, ...prev]);
    return res.data.data;
  };

  const editVehicle = async (id, data) => {
    const res = await vehicleService.updateVehicle(id, data);
    setVehicles((prev) => prev.map((v) => (v._id === id ? res.data.data : v)));
    return res.data.data;
  };

  const removeVehicle = async (id) => {
    await vehicleService.deleteVehicle(id);
    setVehicles((prev) => prev.filter((v) => v._id !== id));
  };

  const purchaseVehicle = async (id) => {
    const res = await vehicleService.purchaseVehicle(id);
    setVehicles((prev) => prev.map((v) => (v._id === id ? res.data.data : v)));
    return res.data.data;
  };

  const restockVehicle = async (id, quantity) => {
    const res = await vehicleService.restockVehicle(id, quantity);
    setVehicles((prev) => prev.map((v) => (v._id === id ? res.data.data : v)));
    return res.data.data;
  };

  return (
    <VehicleContext.Provider
      value={{
        vehicles,
        isLoading,
        error,
        fetchVehicles,
        searchVehicles,
        addVehicle,
        editVehicle,
        removeVehicle,
        purchaseVehicle,
        restockVehicle,
      }}
    >
      {children}
    </VehicleContext.Provider>
  );
};

export const useVehicles = () => useContext(VehicleContext);
