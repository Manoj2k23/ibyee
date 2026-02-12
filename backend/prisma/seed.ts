import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@timekeeper.com' },
    update: {},
    create: {
      email: 'admin@timekeeper.com',
      password: adminPassword,
      name: 'Admin User',
      role: 'ADMIN'
    }
  });
  console.log('✅ Created admin user:', admin.email);

  // Create manager user
  const managerPassword = await bcrypt.hash('manager123', 10);
  const manager = await prisma.user.upsert({
    where: { email: 'manager@timekeeper.com' },
    update: {},
    create: {
      email: 'manager@timekeeper.com',
      password: managerPassword,
      name: 'Store Manager',
      role: 'MANAGER'
    }
  });
  console.log('✅ Created manager user:', manager.email);

  // Create Categories (10 defined in plan)
  const categoriesData = [
    { id: 'CAT001', name: 'Luxury Watches' },
    { id: 'CAT002', name: 'Sports Watches' },
    { id: 'CAT003', name: 'Digital Watches' },
    { id: 'CAT004', name: 'Analog Watches' },
    { id: 'CAT005', name: 'Smart Watches' },
    { id: 'CAT006', name: 'Dress Watches' },
    { id: 'CAT007', name: 'Dive Watches' },
    { id: 'CAT008', name: 'Pilot Watches' },
    { id: 'CAT009', name: 'Field Watches' },
    { id: 'CAT010', name: 'Chronographs' }
  ];

  for (const cat of categoriesData) {
    await prisma.category.upsert({
      where: { id: cat.id },
      update: { name: cat.name },
      create: { id: cat.id, name: cat.name }
    });
  }
  console.log('✅ Created 10 Categories');

  // Create Brands (10 defined in plan)
  const brandsData = [
    { id: 'BRN001', name: 'Rolex' },
    { id: 'BRN002', name: 'Omega' },
    { id: 'BRN003', name: 'Seiko' },
    { id: 'BRN004', name: 'Casio' },
    { id: 'BRN005', name: 'Fossil' },
    { id: 'BRN006', name: 'Titan' },
    { id: 'BRN007', name: 'Apple' },
    { id: 'BRN008', name: 'Samsung' },
    { id: 'BRN009', name: 'Garmin' },
    { id: 'BRN010', name: 'Tag Heuer' }
  ];

  for (const brand of brandsData) {
    await prisma.brand.upsert({
      where: { id: brand.id },
      update: { name: brand.name },
      create: { id: brand.id, name: brand.name }
    });
  }
  console.log('✅ Created 10 Brands');

  // Create Products (10 defined in plan)
  const productsData = [
    {
      name: 'Rolex Submariner',
      sku: 'RLX-SUB-001',
      categoryId: 'CAT001',
      brandId: 'BRN001',
      mrp: 1250000,
      sellingPrice: 1250000,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 5,
      minStockLevel: 2,
      hsnCode: '9102',
      status: true,
      description: 'The archetype of the divers watch.'
    },
    {
      name: 'Omega Speedmaster',
      sku: 'OMG-SPD-002',
      categoryId: 'CAT010',
      brandId: 'BRN002',
      mrp: 750000,
      sellingPrice: 680000,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 8,
      minStockLevel: 3,
      hsnCode: '9102',
      status: true,
      description: ' The Moonwatch.'
    },
    {
      name: 'Seiko 5 Sports',
      sku: 'SKO-SPT-003',
      categoryId: 'CAT002',
      brandId: 'BRN003',
      mrp: 25000,
      sellingPrice: 22500,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 50,
      minStockLevel: 10,
      hsnCode: '9102',
      status: true,
      description: 'Reliable automatic sports watch.'
    },
    {
      name: 'Casio G-Shock',
      sku: 'CSO-GBD-004',
      categoryId: 'CAT003',
      brandId: 'BRN004',
      mrp: 12995,
      sellingPrice: 11500,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 100,
      minStockLevel: 20,
      hsnCode: '9102',
      status: true,
      description: 'Absolute toughness.'
    },
    {
      name: 'Fossil Gen 6',
      sku: 'FSL-G6-005',
      categoryId: 'CAT005',
      brandId: 'BRN005',
      mrp: 24995,
      sellingPrice: 18995,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 30,
      minStockLevel: 5,
      hsnCode: '9102',
      status: true,
      description: 'Smartwatch with Wear OS.'
    },
    {
      name: 'Titan Edge Ceramic',
      sku: 'TTN-EDG-006',
      categoryId: 'CAT006',
      brandId: 'BRN006',
      mrp: 32995,
      sellingPrice: 29995,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 25,
      minStockLevel: 5,
      hsnCode: '9102',
      status: true,
      description: 'Slimmest ceramic watch.'
    },
    {
      name: 'Apple Watch Ultra 2',
      sku: 'APL-ULT-007',
      categoryId: 'CAT005',
      brandId: 'BRN007',
      mrp: 89900,
      sellingPrice: 89900,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 15,
      minStockLevel: 5,
      hsnCode: '9102',
      status: true,
      description: 'Rugged and capable.'
    },
    {
      name: 'Samsung Galaxy Watch 6',
      sku: 'SMG-GW6-008',
      categoryId: 'CAT005',
      brandId: 'BRN008',
      mrp: 34999,
      sellingPrice: 29999,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 40,
      minStockLevel: 10,
      hsnCode: '9102',
      status: true,
      description: 'Your health journey starts here.'
    },
    {
      name: 'Garmin Fenix 7 Pro',
      sku: 'GRM-FNX-009',
      categoryId: 'CAT002',
      brandId: 'BRN009',
      mrp: 85990,
      sellingPrice: 79990,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 10,
      minStockLevel: 2,
      hsnCode: '9102',
      status: true,
      description: 'Multisport GPS watch.'
    },
    {
      name: 'Tag Heuer Carrera',
      sku: 'TAG-CRR-010',
      categoryId: 'CAT001',
      brandId: 'BRN010',
      mrp: 450000,
      sellingPrice: 425000,
      gstPercentage: 18,
      unit: 'PCS',
      openingStock: 4,
      minStockLevel: 1,
      hsnCode: '9102',
      status: true,
      description: 'The racing chronograph.'
    }
  ];

  for (const product of productsData) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: { ...product },
      create: { ...product }
    });
  }
  console.log('✅ Created', productsData.length, 'Products');

  console.log('🎉 Seeding completed!');
  console.log('\n📝 Test Credentials:');
  console.log('Admin - Email: admin@timekeeper.com, Password: admin123');
  console.log('Manager - Email: manager@timekeeper.com, Password: manager123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
