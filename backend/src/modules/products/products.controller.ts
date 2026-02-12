import type { Request, Response } from "express";
import {
  productSchema,
  type TProduct,
  type TProductUpdate,
} from "../../validations/product.validations.js";
import { prisma } from "../../config/prisma.js";
import type { IActionResponse } from "../../types/index.js";

// GET all products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        images: true,
        attributes: true,
      },
    });
    res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// GET single product by ID
export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params;

    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        brand: true,
        images: true,
        attributes: true,
      },
    });

    if (!product) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Failed to fetch product" });
  }
};

// CREATE product
export const createProduct = async (
  req: Request<{}, {}, TProduct>,
  res: Response<IActionResponse<TProduct> | { error: string; details?: any }>
) => {
  try {
    const result = productSchema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors as any,
      });
      return;
    }

    const product = await prisma.product.create({
      data: result.data as any,
      include: {
        category: true,
        brand: true,
        images: true,
        attributes: true,
      },
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product as any, // casting because of included relations
    });
  } catch (error: any) {
    console.error("Error creating product:", error);
    
    // Check if error has code property for Prisma errors
    const errorCode = (error as any).code;

    if (errorCode === "P2002") {
      res.status(409).json({
        success: false,
        message: "A product with this SKU already exists",
        error: "Duplicate SKU",
      } as any);
      return;
    }

    if (errorCode === "P2003") {
      res.status(400).json({
        success: false,
        message: "Invalid category or brand ID",
        error: "Foreign key constraint failed",
      } as any);
      return;
    }

    res.status(500).json({ success: false, message: "Failed to create product", error: "Internal Server Error" } as any);
  }
};

// UPDATE product
export const updateProduct = async (
  req: Request<{ id: string }, {}, TProductUpdate>,
  res: Response<IActionResponse<TProductUpdate> | { error: string }>
) => {
  try {
    const { id } = req.params;

    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ success: false, message: "Product not found", error: "Not Found" } as any);
      return;
    }

    const result = productSchema.partial().safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: result.error.flatten().fieldErrors as any,
      });
      return;
    }

    const product = await prisma.product.update({
      where: { id },
      data: result.data as any,
      include: {
        category: true,
        brand: true,
        images: true,
        attributes: true,
      },
    });

    res.json({
      success: true,
      message: "Product updated successfully",
      data: product as any,
    });
  } catch (error: any) {
    console.error("Error updating product:", error);
    
    const errorCode = (error as any).code;

    if (errorCode === "P2002") {
      res.status(409).json({
        success: false,
        message: "A product with this SKU already exists",
        error: "Duplicate SKU",
      } as any);
      return;
    }

    if (errorCode === "P2003") {
      res.status(400).json({
        success: false,
        message: "Invalid category or brand ID",
        error: "Foreign key constraint failed",
      } as any);
      return;
    }

    res.status(500).json({ success: false, message: "Failed to update product", error: "Internal Server Error" } as any);
  }
};



// DELETE product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params as { id: string };

    // Check if product exists
    const existing = await prisma.product.findUnique({
      where: { id },
    });

    if (!existing) {
      res.status(404).json({ error: "Product not found" });
      return;
    }

    // Delete related records first (images, attributes) then the product
    // Using a transaction to ensure data consistency
    await prisma.$transaction([
      prisma.productImage.deleteMany({ where: { productId: id } }),
      prisma.productAttribute.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id } }),
    ]);

    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Failed to delete product" });
  }
};
