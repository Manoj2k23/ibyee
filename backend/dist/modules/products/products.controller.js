import { createProductSchema } from "../../validations/product.validations.js";
import { prisma } from "../../config/prisma.js";
export const createProduct = async (req, res) => {
    const data = createProductSchema.parse(req.body);
    const product = await prisma.product.create({
        data
    });
    res.status(201).json(product);
};
//# sourceMappingURL=products.controller.js.map