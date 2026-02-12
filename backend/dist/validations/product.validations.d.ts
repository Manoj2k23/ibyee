import { z } from "zod";
export declare const createProductSchema: z.ZodObject<{
    name: z.ZodString;
    sku: z.ZodString;
    mrp: z.ZodNumber;
    sellingPrice: z.ZodNumber;
    gstPercentage: z.ZodNumber;
    unit: z.ZodString;
    openingStock: z.ZodNumber;
    minStockLevel: z.ZodNumber;
    categoryId: z.ZodString;
    brandId: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=product.validations.d.ts.map