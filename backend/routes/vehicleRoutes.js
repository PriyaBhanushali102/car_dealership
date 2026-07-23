import express from "express";
import {
  createVehicle,
  getVehicles,
  searchVehicles,
  updateVehicle,
  deleteVehicle,
  purchaseVehicle,
  restockVehicle,
} from "../controllers/vehicleController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.post("/", protect, createVehicle);
router.post("/test", protect, createVehicle);

router.get("/", getVehicles);
router.get("/search", searchVehicles);
router.put("/:id", protect, updateVehicle);
router.patch("/:id", protect, updateVehicle);
router.delete("/:id", protect, adminOnly, deleteVehicle);
router.post("/:id/purchase", purchaseVehicle);
router.post("/:id/restock", protect, adminOnly, restockVehicle);

export default router;
