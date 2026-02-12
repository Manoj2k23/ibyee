
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkData() {
  try {
    const dbUrl = process.env.DATABASE_URL || '';
    const projectId = dbUrl.match(/@db\.(.*?)\.supabase/)?.[1];
    
    console.log(`Checking Database: ...${projectId}...`);
    
    const userCount = await prisma.user.count();
    const catCount = await prisma.category.count();
    const brandCount = await prisma.brand.count();

    console.log(`Users: ${userCount}`);
    console.log(`Categories: ${catCount}`);
    console.log(`Brands: ${brandCount}`);
    
    if (userCount > 0) {
      const u = await prisma.user.findFirst();
      console.log('Sample User:', u?.email);
    }

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkData();
