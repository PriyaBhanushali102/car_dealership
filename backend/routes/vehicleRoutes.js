import express from "express";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle
} from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly} from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createVehicle);
router.get("/", protect, getVehicles);
router.put("/:id", protect,updateVehicle);
router.delete("/:id", protect, adminOnly, deleteVehicle);

export default router;
