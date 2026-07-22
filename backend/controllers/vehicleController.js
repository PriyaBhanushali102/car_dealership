import Vehicle from "../models/Vehicle.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

export const createVehicle = asyncHandler(async (req, res) => {
  console.log("CREATE VEHICLE HIT");
  const { make, model, category, price, quantity } = req.body;



  const vehicle = await Vehicle.create({
    make,
    model,
    category,
    price,
    quantity,
  });

  console.log("VEHICLE CREATED");

  res.status(201).json({
    success: true,
    data: vehicle,
  });
});

export const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({
    success: true,
    data: vehicles,
  });
});

export const updateVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  res.status(200).json({
    success: true,
    data: vehicle,
  });
});


export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

  if (!vehicle) {
    throw new AppError("Vehicle not found", 404);
  }

  res.status(200).json({
    success: true,
    message: "Vehicle deleted successfully",
  });
});