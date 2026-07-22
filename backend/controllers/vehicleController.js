import Vehicle from "../models/Vehicle.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../utils/AppError.js";

// create a vehicle
export const createVehicle = asyncHandler(async (req, res) => {
  const { make, model, category, price, quantity } = req.body;

  if (!make || !model || !category || price == null || quantity == null) {
    throw new AppError(
      "Please provide make, model, category, price, and quantity",
      400,
    );
  }

  const vehicle = await Vehicle.create({
    make,
    model,
    category,
    price,
    quantity,
  });

  res.status(201).json({
    success: true,
    data: vehicle,
  });
});

// get all vehicles
export const getVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find();

  res.status(200).json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

// GET /api/vehicles/search?make=&model=&category=&minPrice=&maxPrice=
export const searchVehicles = asyncHandler(async (req, res) => {
  const { make, model, category, minPrice, maxPrice } = req.query;
  const filter = {};

  if (make) filter.make = new RegExp(make, "i");
  if (model) filter.model = new RegExp(model, "i");
  if (category) filter.category = category;

  if (minPrice != null || maxPrice != null) {
    filter.price = {};
    if (minPrice != null) filter.price.$gte = Number(minPrice);
    if (maxPrice != null) filter.price.$lte = Number(maxPrice);
  }

  const vehicles = await Vehicle.find(filter);

  res.status(200).json({
    success: true,
    count: vehicles.length,
    data: vehicles,
  });
});

// update a vehicle
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

// delete a vehicle (Admin only — enforced in routes)
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
