import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

// Generate friendly category ID (CAT001, CAT002, etc.)
const generateCategoryId = async (): Promise<string> => {
  const lastCategory = await prisma.category.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });

  if (!lastCategory || !lastCategory.id.startsWith('CAT')) {
    return 'CAT001';
  }

  const lastNumber = parseInt(lastCategory.id.replace('CAT', ''), 10);
  const nextNumber = lastNumber + 1;
  return `CAT${String(nextNumber).padStart(3, '0')}`;
};

// GET all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: categories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, error: "Failed to fetch categories" });
  }
};

// GET single category by ID
export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const category = await prisma.category.findUnique({
      where: { id },
      include: { products: { select: { id: true, name: true } } }
    });

    if (!category) {
      res.status(404).json({ success: false, error: "Category not found" });
      return;
    }

    res.json({ success: true, data: category });
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ success: false, error: "Failed to fetch category" });
  }
};

// CREATE category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: "Category name is required (min 2 characters)" });
      return;
    }

    const categoryId = await generateCategoryId();

    const category = await prisma.category.create({
      data: { 
        id: categoryId,
        name: name.trim() 
      }
    });

    res.status(201).json({ success: true, message: "Category created successfully", data: category });
  } catch (error: any) {
    console.error("Error creating category:", error);
    res.status(500).json({ success: false, error: "Failed to create category" });
  }
};

// UPDATE category
export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: "Category name is required (min 2 characters)" });
      return;
    }

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: "Category not found" });
      return;
    }

    const category = await prisma.category.update({
      where: { id },
      data: { name: name.trim() }
    });

    res.json({ success: true, message: "Category updated successfully", data: category });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ success: false, error: "Failed to update category" });
  }
};

// DELETE category
export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.category.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: "Category not found" });
      return;
    }

    // Check if category has products
    const productCount = await prisma.product.count({ where: { categoryId: id } });
    if (productCount > 0) {
      res.status(400).json({ 
        success: false, 
        error: `Cannot delete category. It has ${productCount} product(s) associated.` 
      });
      return;
    }

    await prisma.category.delete({ where: { id } });
    res.json({ success: true, message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ success: false, error: "Failed to delete category" });
  }
};
