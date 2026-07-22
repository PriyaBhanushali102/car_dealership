import express from "express";
import {
  createVehicle,
  getVehicles,
  updateVehicle,
  deleteVehicle,
} from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", createVehicle);
router.get("/", getVehicles);
router.put("/:id", updateVehicle);
router.delete("/:id", protect, adminOnly, deleteVehicle);

export default router;
