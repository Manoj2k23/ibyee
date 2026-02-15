import express from "express";
import cors from "cors";
import productRoutes from "./modules/products/products.routes.js";
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import categoryRoutes from "./modules/categories/categories.routes.js";
import brandRoutes from "./modules/brands/brands.routes.js";
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const app = express();
app.use(cors({
  origin: [
    "http://localhost:4200",
    "https://ibyee.vercel.app",
    "https://ibyee-36u4qjlk2-manojkumarzmk007-gmailcoms-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

 
app.use(express.json());

// Health check endpoint
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Watch Management API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/brands", brandRoutes);
app.use("/api/dashboard", dashboardRoutes);

export default app;
