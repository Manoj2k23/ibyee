import { Router } from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "./products.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

// GET all products (public)
router.get("/", getProducts);

// GET single product by ID (public)
router.get("/:id", getProductById);

// CREATE product (requires auth + ADMIN or MANAGER role)
router.post("/", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), createProduct);

// UPDATE product (requires auth + ADMIN or MANAGER role)
router.put("/:id", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), updateProduct);

// DELETE product (requires auth + ADMIN role only)
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteProduct);

export default router;
