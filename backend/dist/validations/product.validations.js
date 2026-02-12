import { z } from "zod";
export const createProductSchema = z.object({
    name: z.string().min(2),
    sku: z.string(),
    mrp: z.number().positive(),
    sellingPrice: z.number().positive(),
    gstPercentage: z.number(),
    unit: z.string(),
    openingStock: z.number().int(),
    minStockLevel: z.number().int(),
    categoryId: z.string(),
    brandId: z.string()
});
//# sourceMappingURL=product.validations.js.map