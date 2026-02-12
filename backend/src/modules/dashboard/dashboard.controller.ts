import type { Request, Response } from 'express';
import { UserStatus } from '@prisma/client';
import { prisma } from '../../config/prisma.js';

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const [productCount, categoryCount, brandCount, userCount, lowStockProducts, latestProducts] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.user.count({
        where: {
          status: UserStatus.ACTIVE
        }
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: {
          openingStock: 'asc'
        },
        where: {
          status: true,
          openingStock: {
            lt: 20
          }
        },
        select: {
          id: true,
          name: true,
          sku: true,
          openingStock: true,
          minStockLevel: true,
          images: {
             take: 1
          }
        }
      }),
      prisma.product.findMany({
        take: 5,
        orderBy: {
          createdAt: 'desc'
        },
        include: {
          category: true,
          brand: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        counts: {
          products: productCount,
          categories: categoryCount,
          brands: brandCount,
          users: userCount,
        },
        lowStockProducts,
        latestProducts
      },
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
};
