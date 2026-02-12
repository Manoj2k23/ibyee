import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(2),
  sku: z.string(),
  barcode: z.string().optional(),
  description: z.string().optional(),
  status: z.boolean().optional(),
  mrp: z.number().positive(),
  sellingPrice: z.number().positive(),
  gstPercentage: z.number(),
  hsnCode: z.string().optional(),
  unit: z.string(),
  openingStock: z.number().int(),
  minStockLevel: z.number().int(),
  categoryId: z.string().uuid(),
  brandId: z.string().uuid(),
});

export type TProduct = z.infer<typeof productSchema>;
export type TProductUpdate = Partial<TProduct>;
