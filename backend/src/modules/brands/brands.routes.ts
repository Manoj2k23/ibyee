import { Router } from "express";
import {
  createBrand,
  deleteBrand,
  getBrands,
  getBrandById,
  updateBrand,
} from "./brands.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

// GET all brands (public)
router.get("/", getBrands);

// GET single brand by ID (public)
router.get("/:id", getBrandById);

// CREATE brand (requires auth + ADMIN or MANAGER role)
router.post("/", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), createBrand);

// UPDATE brand (requires auth + ADMIN or MANAGER role)
router.put("/:id", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), updateBrand);

// DELETE brand (requires auth + ADMIN role only)
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteBrand);

export default router;
