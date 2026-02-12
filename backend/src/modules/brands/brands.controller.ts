import type { Request, Response } from "express";
import { prisma } from "../../config/prisma.js";

// Generate friendly brand ID (BRN001, BRN002, etc.)
const generateBrandId = async (): Promise<string> => {
  const lastBrand = await prisma.brand.findFirst({
    orderBy: { id: 'desc' },
    select: { id: true }
  });

  if (!lastBrand || !lastBrand.id.startsWith('BRN')) {
    return 'BRN001';
  }

  const lastNumber = parseInt(lastBrand.id.replace('BRN', ''), 10);
  const nextNumber = lastNumber + 1;
  return `BRN${String(nextNumber).padStart(3, '0')}`;
};

// GET all brands
export const getBrands = async (req: Request, res: Response) => {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: 'asc' }
    });
    res.json({ success: true, data: brands });
  } catch (error) {
    console.error("Error fetching brands:", error);
    res.status(500).json({ success: false, error: "Failed to fetch brands" });
  }
};

// GET single brand by ID
export const getBrandById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const brand = await prisma.brand.findUnique({
      where: { id },
      include: { products: { select: { id: true, name: true } } }
    });

    if (!brand) {
      res.status(404).json({ success: false, error: "Brand not found" });
      return;
    }

    res.json({ success: true, data: brand });
  } catch (error) {
    console.error("Error fetching brand:", error);
    res.status(500).json({ success: false, error: "Failed to fetch brand" });
  }
};

// CREATE brand
export const createBrand = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: "Brand name is required (min 2 characters)" });
      return;
    }

    const brandId = await generateBrandId();

    const brand = await prisma.brand.create({
      data: { 
        id: brandId,
        name: name.trim() 
      }
    });

    res.status(201).json({ success: true, message: "Brand created successfully", data: brand });
  } catch (error: any) {
    console.error("Error creating brand:", error);
    res.status(500).json({ success: false, error: "Failed to create brand" });
  }
};

// UPDATE brand
export const updateBrand = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const { name } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      res.status(400).json({ success: false, error: "Brand name is required (min 2 characters)" });
      return;
    }

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: "Brand not found" });
      return;
    }

    const brand = await prisma.brand.update({
      where: { id },
      data: { name: name.trim() }
    });

    res.json({ success: true, message: "Brand updated successfully", data: brand });
  } catch (error) {
    console.error("Error updating brand:", error);
    res.status(500).json({ success: false, error: "Failed to update brand" });
  }
};

// DELETE brand
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;

    const existing = await prisma.brand.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, error: "Brand not found" });
      return;
    }

    // Check if brand has products
    const productCount = await prisma.product.count({ where: { brandId: id } });
    if (productCount > 0) {
      res.status(400).json({ 
        success: false, 
        error: `Cannot delete brand. It has ${productCount} product(s) associated.` 
      });
      return;
    }

    await prisma.brand.delete({ where: { id } });
    res.json({ success: true, message: "Brand deleted successfully" });
  } catch (error) {
    console.error("Error deleting brand:", error);
    res.status(500).json({ success: false, error: "Failed to delete brand" });
  }
};
