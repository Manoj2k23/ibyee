import { Router } from "express";
import { createProduct } from "./products.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { roleMiddleware } from "../../middlewares/role.middleware.js";
const router = Router();
router.post("/", authMiddleware, roleMiddleware("ADMIN", "MANAGER"), createProduct);
export default router;
//# sourceMappingURL=products.routes.js.map