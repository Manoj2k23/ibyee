import { Router } from "express";
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  updateCategory,
} from "./categories.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";

const router = Router();

// GET all categories (public)
router.get("/", getCategories);

// GET single category by ID (public)
router.get("/:id", getCategoryById);

// CREATE category (requires auth + ADMIN or MANAGER role)
router.post("/", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), createCategory);

// UPDATE category (requires auth + ADMIN or MANAGER role)
router.put("/:id", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), updateCategory);

// DELETE category (requires auth + ADMIN role only)
router.delete("/:id", authMiddleware, roleMiddleware("ADMIN"), deleteCategory);

export default router;
