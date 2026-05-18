import bcrypt from 'bcrypt';
import { AuditAction, PrismaClient, Role, UserStatus, WarehouseType, ItemType, ProjectStatus } from '@prisma/client';

const prisma = new PrismaClient();

const defaultPassword = process.env.SEED_DEFAULT_PASSWORD ?? 'HomeX@2026!';

async function main() {
  const passwordHash = await bcrypt.hash(defaultPassword, 12);

  const users = await Promise.all(
    [
      ['superadmin@homex.local', 'Home-X Super Administrator', Role.SUPER_ADMIN, 'HX-EMP-001', 'System Owner'],
      ['admin@homex.local', 'Home-X Admin', Role.ADMIN, 'HX-EMP-002', 'Administration Lead'],
      ['manager@homex.local', 'Home-X Project Manager', Role.MANAGER, 'HX-EMP-003', 'Project Controls Manager'],
      ['engineer@homex.local', 'Home-X Site Engineer', Role.SITE_ENGINEER, 'HX-EMP-004', 'Site Engineer'],
      ['storekeeper@homex.local', 'Home-X Main Storekeeper', Role.STOREKEEPER, 'HX-EMP-005', 'Main Storekeeper'],
      ['accountant@homex.local', 'Home-X Accountant', Role.ACCOUNTANT, 'HX-EMP-006', 'Cost Accountant'],
      ['worker@homex.local', 'Home-X Skilled Worker', Role.WORKER, 'HX-EMP-007', 'Mason'],
    ].map(([email, fullName, role, employeeCode, jobTitle]) =>
      prisma.user.upsert({
        where: { email: email as string },
        update: {
          fullName: fullName as string,
          role: role as Role,
          status: UserStatus.ACTIVE,
          employeeCode: employeeCode as string,
          jobTitle: jobTitle as string,
        },
        create: {
          email: email as string,
          passwordHash,
          fullName: fullName as string,
          role: role as Role,
          status: UserStatus.ACTIVE,
          employeeCode: employeeCode as string,
          jobTitle: jobTitle as string,
        },
      }),
    ),
  );

  const [superAdmin, admin, manager, siteEngineer, storekeeper] = users;

  const settings = [
    ['companyProfile', { legalName: 'Home-X Construction PLC', shortName: 'Home-X', country: 'Ethiopia' }, 'Company identity displayed in labels and reports.'],
    ['allowNegativeStock', false, 'If true, privileged users may post stock movements that make balances negative.'],
    ['stockCostingMethod', 'WEIGHTED_AVERAGE', 'Phase 1 costing method; batch costing can be added later.'],
    ['highValueAuditThreshold', '50000.0000', 'Stock changes at or above this value require extra audit attention.'],
    ['defaultCurrency', 'ETB', 'Default reporting currency.'],
  ] as const;

  for (const [key, value, description] of settings) {
    await prisma.companySetting.upsert({
      where: { key },
      update: { value, description, updatedById: superAdmin.id },
      create: { key, value, description, updatedById: superAdmin.id },
    });
  }

  const unitRows = [
    ['PCS', 'Piece', 'pcs'],
    ['BAG', 'Bag', 'bag'],
    ['KG', 'Kilogram', 'kg'],
    ['M', 'Meter', 'm'],
    ['M2', 'Square Meter', 'm²'],
    ['M3', 'Cubic Meter', 'm³'],
    ['L', 'Liter', 'L'],
    ['HR', 'Hour', 'hr'],
  ];

  const units = new Map<string, { id: string }>();
  for (const [code, name, symbol] of unitRows) {
    const unit = await prisma.unit.upsert({
      where: { code },
      update: { name, symbol },
      create: { code, name, symbol },
    });
    units.set(code, unit);
  }

  const categoryRows = [
    ['CEMENT', 'Cement and Binding Materials', 'Cement, mortar, and binding supplies'],
    ['STEEL', 'Rebar and Structural Steel', 'Steel reinforcement and structural metal items'],
    ['AGG', 'Aggregates', 'Sand, gravel, and crushed stone'],
    ['TOOLS', 'Construction Tools', 'Reusable hand and power tools'],
    ['EQUIP', 'Construction Equipment', 'Heavy equipment and machines'],
    ['PPE', 'Safety and PPE', 'Personal protective equipment'],
    ['FUEL', 'Fuel and Lubricants', 'Diesel, petrol, oils, and lubricants'],
  ];

  const categories = new Map<string, { id: string }>();
  for (const [code, name, description] of categoryRows) {
    const category = await prisma.itemCategory.upsert({
      where: { code },
      update: { name, description, createdById: admin.id },
      create: { code, name, description, createdById: admin.id },
    });
    categories.set(code, category);
  }

  const supplier = await prisma.supplier.upsert({
    where: { code: 'SUP-001' },
    update: {
      name: 'Addis Construction Materials Supplier',
      contactPerson: 'Procurement Desk',
      phone: '+251-900-000-001',
      email: 'sales@example-supplier.local',
      createdById: admin.id,
    },
    create: {
      code: 'SUP-001',
      name: 'Addis Construction Materials Supplier',
      contactPerson: 'Procurement Desk',
      phone: '+251-900-000-001',
      email: 'sales@example-supplier.local',
      address: 'Addis Ababa Industrial Zone',
      createdById: admin.id,
    },
  });

  const project = await prisma.project.upsert({
    where: { code: 'HX-PRJ-001' },
    update: {
      name: 'Home-X Riverside Mixed-Use Building',
      clientName: 'Home-X Development Division',
      location: 'Addis Ababa Riverside District',
      status: ProjectStatus.ACTIVE,
      budget: '18500000.0000',
      createdById: manager.id,
    },
    create: {
      code: 'HX-PRJ-001',
      name: 'Home-X Riverside Mixed-Use Building',
      description: 'Pilot construction project used to seed Home-X inventory workflows.',
      clientName: 'Home-X Development Division',
      location: 'Addis Ababa Riverside District',
      status: ProjectStatus.ACTIVE,
      startDate: new Date('2026-01-15T00:00:00.000Z'),
      budget: '18500000.0000',
      createdById: manager.id,
    },
  });

  const phaseNames = [
    'Mobilization',
    'Excavation',
    'Foundation',
    'Structure',
    'Block Work',
    'Roofing',
    'Plumbing',
    'Electrical',
    'Finishing',
    'Handover',
  ];

  for (const [index, name] of phaseNames.entries()) {
    await prisma.projectPhase.upsert({
      where: { projectId_name: { projectId: project.id, name } },
      update: { sequence: index + 1, budget: String((index + 1) * 250000) },
      create: { projectId: project.id, name, sequence: index + 1, budget: String((index + 1) * 250000) },
    });
  }

  const site = await prisma.site.upsert({
    where: { code: 'HX-SITE-RIVER-001' },
    update: {
      name: 'Riverside Main Site',
      projectId: project.id,
      createdById: siteEngineer.id,
      qrCodeValue: 'homex://site/HX-SITE-RIVER-001',
    },
    create: {
      code: 'HX-SITE-RIVER-001',
      name: 'Riverside Main Site',
      address: 'Riverside District, Addis Ababa',
      projectId: project.id,
      createdById: siteEngineer.id,
      qrCodeValue: 'homex://site/HX-SITE-RIVER-001',
    },
  });

  const warehouseRows = [
    ['HX-WH-MAIN', 'Home-X Main Store', WarehouseType.MAIN_STORE, null, null, 'Home-X central construction store'],
    ['HX-WH-TRANSIT', 'Transit Holding Warehouse', WarehouseType.TRANSIT, null, null, 'Temporary in-transit materials holding area'],
    ['HX-WH-RIVER', 'Riverside Project Store', WarehouseType.PROJECT_SITE, project.id, site.id, 'Project-site material store'],
    ['HX-TRUCK-01', 'Truck 01 Mobile Store', WarehouseType.TRUCK, null, null, 'Mobile truck inventory location'],
    ['HX-WH-DAMAGED', 'Damaged Goods Cage', WarehouseType.DAMAGED, null, null, 'Controlled damaged item holding area'],
    ['HX-WH-RETURNED', 'Returned Materials Bay', WarehouseType.RETURNED, null, null, 'Returned site materials under inspection'],
    ['HX-WH-SCRAP', 'Scrap Yard', WarehouseType.SCRAP, null, null, 'Scrap and disposal area'],
  ] as const;

  const warehouses = new Map<string, { id: string }>();
  for (const [code, name, type, projectId, siteId, address] of warehouseRows) {
    const warehouse = await prisma.warehouse.upsert({
      where: { code },
      update: {
        name,
        type,
        projectId,
        siteId,
        address,
        createdById: storekeeper.id,
        qrCodeValue: `homex://warehouse/${code}`,
      },
      create: {
        code,
        name,
        type,
        projectId,
        siteId,
        address,
        createdById: storekeeper.id,
        qrCodeValue: `homex://warehouse/${code}`,
      },
    });
    warehouses.set(code, warehouse);
  }

  const itemRows = [
    ['MAT-CEM-OPC-001', 'OPC Cement 50kg Bag', ItemType.MATERIAL, 'CEMENT', 'BAG', '640.0000', '100.0000', false],
    ['MAT-STEEL-RB12', '12mm Reinforcement Bar', ItemType.MATERIAL, 'STEEL', 'M', '185.0000', '500.0000', false],
    ['MAT-AGG-SAND', 'Washed Sand', ItemType.MATERIAL, 'AGG', 'M3', '1450.0000', '20.0000', false],
    ['TOOL-DRILL-001', 'Rotary Hammer Drill', ItemType.TOOL, 'TOOLS', 'PCS', '18000.0000', '2.0000', true],
    ['TOOL-SCAF-SET', 'Scaffolding Set', ItemType.TOOL, 'TOOLS', 'PCS', '32000.0000', '4.0000', true],
    ['EQP-MIXER-001', 'Concrete Mixer 350L', ItemType.EQUIPMENT, 'EQUIP', 'PCS', '95000.0000', '1.0000', true],
    ['PPE-HELMET-001', 'Safety Helmet', ItemType.PPE, 'PPE', 'PCS', '750.0000', '25.0000', true],
    ['FUEL-DIESEL', 'Diesel Fuel', ItemType.FUEL, 'FUEL', 'L', '95.0000', '500.0000', false],
    ['CONS-NAIL-3IN', '3 Inch Nails', ItemType.CONSUMABLE, 'STEEL', 'KG', '160.0000', '50.0000', false],
  ] as const;

  for (const [code, name, type, categoryCode, unitCode, defaultUnitCost, reorderLevel, isTrackable] of itemRows) {
    await prisma.item.upsert({
      where: { code },
      update: {
        name,
        type,
        categoryId: categories.get(categoryCode)!.id,
        unitId: units.get(unitCode)!.id,
        defaultUnitCost,
        reorderLevel,
        isTrackable,
        qrCodeValue: `homex://item/${code}`,
        createdById: admin.id,
      },
      create: {
        code,
        name,
        type,
        categoryId: categories.get(categoryCode)!.id,
        unitId: units.get(unitCode)!.id,
        defaultUnitCost,
        reorderLevel,
        isTrackable,
        qrCodeValue: `homex://item/${code}`,
        createdById: admin.id,
      },
    });
  }

  await prisma.auditLog.create({
    data: {
      action: AuditAction.CREATE,
      entityType: 'SeedData',
      actorId: superAdmin.id,
      summary: `Seeded Home-X foundation data, including supplier ${supplier.code} and ${warehouses.size} warehouses.`,
      metadata: {
        phase: 'Phase 1',
        defaultPasswordNotice: 'Development-only password; rotate before production.',
      },
    },
  });

  console.log('Home-X seed completed.');
  console.log(`Development seed password: ${defaultPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
