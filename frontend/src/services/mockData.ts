export type ItemType = 'MATERIAL' | 'TOOL' | 'EQUIPMENT' | 'PPE' | 'FUEL' | 'CONSUMABLE';
export type MovementType = 'PURCHASE_RECEIPT' | 'MATERIAL_TRANSFER' | 'MATERIAL_ISSUE' | 'RETURN_FROM_SITE' | 'DAMAGE' | 'LOSS';
export type RequestStatus = 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'ISSUED' | 'PARTIALLY_ISSUED';

export interface DashboardSummary {
  totalStockValue: number;
  activeProjects: number;
  pendingMaterialRequests: number;
  lowStockItems: number;
  toolsCheckedOut: number;
  fuelCostThisMonth: number;
  damageLossCount: number;
  materialsConsumedToday: number;
}

export interface ItemRecord {
  id: string;
  code: string;
  name: string;
  type: ItemType;
  category: string;
  unit: string;
  totalStock: number;
  lowStockThreshold: number;
  valuation: number;
  qrCode: string;
  warehouse: string;
  status: 'OK' | 'LOW' | 'CRITICAL';
}

export interface WarehouseRecord {
  id: string;
  code: string;
  name: string;
  type: string;
  location: string;
  responsible: string;
  itemCount: number;
  stockValue: number;
  status: string;
}

export interface ProjectRecord {
  id: string;
  code: string;
  name: string;
  site: string;
  status: string;
  budget: number;
  materialBudgetUsed: number;
  manager: string;
  engineer: string;
  phases: Array<{ name: string; budget: number; used: number }>;
}

export interface StockMovementRecord {
  id: string;
  type: MovementType;
  item: string;
  quantity: number;
  unit: string;
  from?: string;
  to?: string;
  project?: string;
  phase?: string;
  value: number;
  actor: string;
  time: string;
}

export interface MaterialRequestRecord {
  id: string;
  number: string;
  project: string;
  phase: string;
  requestedBy: string;
  approvedBy?: string;
  neededDate: string;
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT';
  status: RequestStatus;
  reason: string;
  lines: Array<{ item: string; quantity: number; unit: string }>;
}

export interface ToolCheckoutRecord {
  id: string;
  tool: string;
  code: string;
  worker: string;
  project: string;
  checkedOutAt: string;
  dueAt: string;
  status: 'CHECKED_OUT' | 'RETURNED' | 'OVERDUE';
  conditionOut: string;
  conditionIn?: string;
}

export interface EquipmentRecord {
  id: string;
  code: string;
  name: string;
  status: 'AVAILABLE' | 'ASSIGNED' | 'MAINTENANCE';
  project: string;
  operator: string;
  hoursThisMonth: number;
  fuelCost: number;
  nextService: string;
}

export interface ReportCardRecord {
  title: string;
  description: string;
  metric: string;
  exportName: string;
}

export const dashboardSummary: DashboardSummary = {
  totalStockValue: 12_845_600,
  activeProjects: 3,
  pendingMaterialRequests: 7,
  lowStockItems: 4,
  toolsCheckedOut: 18,
  fuelCostThisMonth: 186_450,
  damageLossCount: 3,
  materialsConsumedToday: 42,
};

export const workers = ['Storekeeper', 'Site Engineer', 'Masonry Team', 'Electrical Team', 'Driver'];

export const projects: ProjectRecord[] = [
  {
    id: 'prj-bole-villa',
    code: 'HX-BOLE-VILLA',
    name: 'Bole Residential Villa',
    site: 'Bole Site Store',
    status: 'ACTIVE',
    budget: 8_500_000,
    materialBudgetUsed: 3_100_000,
    manager: 'Home-X Project Manager',
    engineer: 'Site Engineer',
    phases: [
      { name: 'Foundation', budget: 1_400_000, used: 1_050_000 },
      { name: 'Structure', budget: 2_200_000, used: 1_250_000 },
      { name: 'Electrical', budget: 650_000, used: 180_000 },
    ],
  },
  {
    id: 'prj-summit-warehouse',
    code: 'HX-SUMMIT-WH',
    name: 'Summit Warehouse Extension',
    site: 'Summit Site Store',
    status: 'ACTIVE',
    budget: 12_000_000,
    materialBudgetUsed: 6_700_000,
    manager: 'Home-X Project Manager',
    engineer: 'Site Engineer',
    phases: [
      { name: 'Mobilization', budget: 500_000, used: 410_000 },
      { name: 'Structure', budget: 4_800_000, used: 3_700_000 },
      { name: 'Roofing', budget: 1_300_000, used: 590_000 },
    ],
  },
  {
    id: 'prj-ayat-mixed',
    code: 'HX-AYAT-MIXED',
    name: 'Ayat Mixed-Use Block',
    site: 'Transit / Ayat Receiving Zone',
    status: 'PLANNED',
    budget: 24_000_000,
    materialBudgetUsed: 1_250_000,
    manager: 'Home-X Project Manager',
    engineer: 'Site Engineer',
    phases: [
      { name: 'Mobilization', budget: 800_000, used: 450_000 },
      { name: 'Excavation', budget: 1_600_000, used: 650_000 },
      { name: 'Foundation', budget: 3_200_000, used: 150_000 },
    ],
  },
];

export const warehouses: WarehouseRecord[] = [
  { id: 'wh-main', code: 'HX-WH-MAIN', name: 'Main Store', type: 'MAIN_STORE', location: 'Home-X central yard', responsible: 'Storekeeper', itemCount: 86, stockValue: 7_800_000, status: 'Operational' },
  { id: 'wh-bole', code: 'HX-WH-BOLE', name: 'Bole Site Store', type: 'PROJECT_SITE', location: 'Bole Residential Villa', responsible: 'Site Engineer', itemCount: 34, stockValue: 2_150_000, status: 'Operational' },
  { id: 'wh-summit', code: 'HX-WH-SUMMIT', name: 'Summit Site Store', type: 'PROJECT_SITE', location: 'Summit extension yard', responsible: 'Site Engineer', itemCount: 41, stockValue: 2_540_000, status: 'Operational' },
  { id: 'truck-01', code: 'HX-TRUCK-01', name: 'Truck 01', type: 'TRUCK', location: 'Mobile transfer', responsible: 'Driver', itemCount: 8, stockValue: 270_000, status: 'In transit' },
  { id: 'wh-transit', code: 'HX-WH-TRANSIT', name: 'Transit', type: 'TRANSIT', location: 'Central dispatch bay', responsible: 'Storekeeper', itemCount: 12, stockValue: 640_000, status: 'Dispatching' },
  { id: 'wh-damaged', code: 'HX-WH-DAMAGED', name: 'Damaged Store', type: 'DAMAGED', location: 'Controlled cage', responsible: 'Storekeeper', itemCount: 5, stockValue: 38_600, status: 'Inspection' },
];

export const items: ItemRecord[] = [
  { id: 'opc', code: 'MAT-CEM-OPC-001', name: 'OPC Cement 50kg', type: 'MATERIAL', category: 'Cement', unit: 'bag', totalStock: 920, lowStockThreshold: 300, valuation: 588_800, qrCode: 'HX-QR-OPC', warehouse: 'Main Store', status: 'OK' },
  { id: 'rebar12', code: 'MAT-RB-12', name: 'Rebar 12mm', type: 'MATERIAL', category: 'Steel', unit: 'm', totalStock: 1800, lowStockThreshold: 2400, valuation: 333_000, qrCode: 'HX-QR-RB12', warehouse: 'Main Store', status: 'LOW' },
  { id: 'rebar16', code: 'MAT-RB-16', name: 'Rebar 16mm', type: 'MATERIAL', category: 'Steel', unit: 'm', totalStock: 740, lowStockThreshold: 900, valuation: 196_100, qrCode: 'HX-QR-RB16', warehouse: 'Summit Site Store', status: 'LOW' },
  { id: 'sand', code: 'MAT-SAND-001', name: 'Washed Sand', type: 'MATERIAL', category: 'Aggregates', unit: 'm³', totalStock: 66, lowStockThreshold: 30, valuation: 95_700, qrCode: 'HX-QR-SAND', warehouse: 'Bole Site Store', status: 'OK' },
  { id: 'agg', code: 'MAT-AGG-01', name: 'Aggregate 01', type: 'MATERIAL', category: 'Aggregates', unit: 'm³', totalStock: 22, lowStockThreshold: 40, valuation: 41_800, qrCode: 'HX-QR-AGG01', warehouse: 'Bole Site Store', status: 'LOW' },
  { id: 'block', code: 'MAT-HCB-20', name: 'Hollow Concrete Block', type: 'MATERIAL', category: 'Block Work', unit: 'pcs', totalStock: 5400, lowStockThreshold: 2000, valuation: 351_000, qrCode: 'HX-QR-HCB', warehouse: 'Summit Site Store', status: 'OK' },
  { id: 'pvc', code: 'PLB-PVC-110', name: 'PVC Pipe 110mm', type: 'MATERIAL', category: 'Plumbing', unit: 'm', totalStock: 160, lowStockThreshold: 120, valuation: 57_600, qrCode: 'HX-QR-PVC110', warehouse: 'Main Store', status: 'OK' },
  { id: 'wire', code: 'ELC-CU-2.5', name: 'Copper Wire 2.5mm', type: 'MATERIAL', category: 'Electrical', unit: 'roll', totalStock: 18, lowStockThreshold: 25, valuation: 117_000, qrCode: 'HX-QR-CU25', warehouse: 'Main Store', status: 'CRITICAL' },
  { id: 'helmet', code: 'PPE-HELMET', name: 'Safety Helmet', type: 'PPE', category: 'Safety', unit: 'pcs', totalStock: 88, lowStockThreshold: 50, valuation: 66_000, qrCode: 'HX-QR-HELMET', warehouse: 'Main Store', status: 'OK' },
  { id: 'vest', code: 'PPE-VEST', name: 'Reflective Vest', type: 'PPE', category: 'Safety', unit: 'pcs', totalStock: 42, lowStockThreshold: 60, valuation: 14_700, qrCode: 'HX-QR-VEST', warehouse: 'Main Store', status: 'LOW' },
  { id: 'diesel', code: 'FUEL-DIESEL', name: 'Diesel', type: 'FUEL', category: 'Fuel', unit: 'L', totalStock: 2600, lowStockThreshold: 1000, valuation: 247_000, qrCode: 'HX-QR-DIESEL', warehouse: 'Main Store', status: 'OK' },
  { id: 'grinder', code: 'TOOL-GRINDER', name: 'Angle Grinder', type: 'TOOL', category: 'Power Tools', unit: 'pcs', totalStock: 12, lowStockThreshold: 4, valuation: 108_000, qrCode: 'HX-QR-GRINDER', warehouse: 'Main Store', status: 'OK' },
  { id: 'mixer', code: 'EQP-MIXER', name: 'Concrete Mixer', type: 'EQUIPMENT', category: 'Equipment', unit: 'pcs', totalStock: 3, lowStockThreshold: 1, valuation: 285_000, qrCode: 'HX-QR-MIXER', warehouse: 'Bole Site Store', status: 'OK' },
  { id: 'generator', code: 'EQP-GEN-5KVA', name: 'Generator 5kVA', type: 'EQUIPMENT', category: 'Equipment', unit: 'pcs', totalStock: 2, lowStockThreshold: 1, valuation: 210_000, qrCode: 'HX-QR-GEN5', warehouse: 'Summit Site Store', status: 'OK' },
];

export const recentMovements: StockMovementRecord[] = [
  { id: 'mov-1', type: 'PURCHASE_RECEIPT', item: 'OPC Cement 50kg', quantity: 400, unit: 'bag', to: 'Main Store', value: 256_000, actor: 'Storekeeper', time: 'Today 09:20' },
  { id: 'mov-2', type: 'MATERIAL_TRANSFER', item: 'Rebar 12mm', quantity: 650, unit: 'm', from: 'Main Store', to: 'Bole Site Store', project: 'Bole Residential Villa', value: 120_250, actor: 'Storekeeper', time: 'Today 11:05' },
  { id: 'mov-3', type: 'MATERIAL_ISSUE', item: 'Hollow Concrete Block', quantity: 900, unit: 'pcs', from: 'Summit Site Store', project: 'Summit Warehouse Extension', phase: 'Block Work', value: 58_500, actor: 'Site Engineer', time: 'Yesterday 15:40' },
  { id: 'mov-4', type: 'DAMAGE', item: 'Reflective Vest', quantity: 8, unit: 'pcs', from: 'Main Store', value: 2_800, actor: 'Storekeeper', time: 'Yesterday 17:10' },
];

export const materialRequests: MaterialRequestRecord[] = [
  { id: 'mr-1', number: 'MR-2026-0041', project: 'Bole Residential Villa', phase: 'Structure', requestedBy: 'Site Engineer', approvedBy: 'Project Manager', neededDate: '2026-05-20', priority: 'HIGH', status: 'APPROVED', reason: 'Column reinforcement pour', lines: [{ item: 'Rebar 16mm', quantity: 420, unit: 'm' }, { item: 'OPC Cement 50kg', quantity: 160, unit: 'bag' }] },
  { id: 'mr-2', number: 'MR-2026-0042', project: 'Summit Warehouse Extension', phase: 'Roofing', requestedBy: 'Site Engineer', neededDate: '2026-05-21', priority: 'NORMAL', status: 'SUBMITTED', reason: 'Roof drainage installation', lines: [{ item: 'PVC Pipe 110mm', quantity: 80, unit: 'm' }] },
  { id: 'mr-3', number: 'MR-2026-0043', project: 'Ayat Mixed-Use Block', phase: 'Mobilization', requestedBy: 'Site Engineer', neededDate: '2026-05-19', priority: 'URGENT', status: 'PARTIALLY_ISSUED', reason: 'Temporary power and safety setup', lines: [{ item: 'Generator 5kVA', quantity: 1, unit: 'pcs' }, { item: 'Safety Helmet', quantity: 25, unit: 'pcs' }] },
];

export const toolCheckouts: ToolCheckoutRecord[] = [
  { id: 'tc-1', tool: 'Angle Grinder', code: 'TOOL-GRINDER-03', worker: 'Masonry Team', project: 'Bole Residential Villa', checkedOutAt: '2026-05-16', dueAt: '2026-05-20', status: 'CHECKED_OUT', conditionOut: 'Good, blade guard attached' },
  { id: 'tc-2', tool: 'Drill Machine', code: 'TOOL-DRILL-02', worker: 'Electrical Team', project: 'Summit Warehouse Extension', checkedOutAt: '2026-05-10', dueAt: '2026-05-14', status: 'RETURNED', conditionOut: 'Good', conditionIn: 'Returned with good condition' },
];

export const equipment: EquipmentRecord[] = [
  { id: 'eq-1', code: 'EQP-MIXER-01', name: 'Concrete Mixer', status: 'ASSIGNED', project: 'Bole Residential Villa', operator: 'Masonry Team Lead', hoursThisMonth: 126, fuelCost: 54_200, nextService: '2026-05-30' },
  { id: 'eq-2', code: 'EQP-GEN-5KVA-01', name: 'Generator 5kVA', status: 'ASSIGNED', project: 'Summit Warehouse Extension', operator: 'Electrical Team', hoursThisMonth: 88, fuelCost: 39_900, nextService: '2026-06-03' },
  { id: 'eq-3', code: 'EQP-COMPACTOR-01', name: 'Plate Compactor', status: 'MAINTENANCE', project: 'Main Store', operator: 'Workshop', hoursThisMonth: 21, fuelCost: 8_100, nextService: 'In service now' },
];

export const reportCards: ReportCardRecord[] = [
  { title: 'Stock Balance by Warehouse', description: 'Current quantity, average cost, and valuation by storage location.', metric: '6 warehouses', exportName: 'stock-balance.csv' },
  { title: 'Project Material Cost', description: 'Material issue cost grouped by project and phase.', metric: 'ETB 11.05M', exportName: 'project-material-cost.csv' },
  { title: 'Tool Checkout Report', description: 'Open, returned, damaged, and overdue tool responsibility records.', metric: '18 active', exportName: 'tool-checkouts.csv' },
  { title: 'Equipment Fuel Report', description: 'Fuel liters and costs by equipment, operator, project, and date.', metric: 'ETB 186K', exportName: 'fuel-usage.csv' },
  { title: 'Damage and Loss Report', description: 'Damaged, wasted, stolen, or lost inventory with reasons and evidence.', metric: '3 this month', exportName: 'damage-loss.csv' },
  { title: 'Audit Log Report', description: 'Sensitive stock, approval, user, and setting activity trail.', metric: '142 events', exportName: 'audit-log.csv' },
];

export const siteTimeline = [
  'Bole site received 650m of Rebar 12mm via Truck 01.',
  'Manager approved MR-2026-0041 for Bole Residential Villa.',
  'Generator 5kVA consumed 62L diesel at Summit site.',
  'Damaged reflective vests moved to controlled damaged store.',
];
