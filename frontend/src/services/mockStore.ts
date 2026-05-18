import { items as seedItems, materialRequests as seedRequests, projects as seedProjects, toolCheckouts as seedCheckouts, warehouses as seedWarehouses, recentMovements as seedMovements, dashboardSummary as seedSummary, equipment as seedEquipment, siteTimeline as seedTimeline, workers as seedWorkers, type ItemRecord, type MaterialRequestRecord, type ProjectRecord, type StockMovementRecord, type ToolCheckoutRecord, type WarehouseRecord, type EquipmentRecord } from './mockData';

const STORAGE_KEY = 'homex_demo_state_v2';

export interface DemoState { items: ItemRecord[]; warehouses: WarehouseRecord[]; projects: ProjectRecord[]; materialRequests: MaterialRequestRecord[]; toolCheckouts: ToolCheckoutRecord[]; equipment: EquipmentRecord[]; recentMovements: StockMovementRecord[]; dashboardSummary: typeof seedSummary; siteTimeline: string[]; workers: string[]; settings: { allowNegativeStock: boolean } }
const seedState: DemoState = { items: seedItems, warehouses: seedWarehouses, projects: seedProjects, materialRequests: seedRequests, toolCheckouts: seedCheckouts, equipment: seedEquipment, recentMovements: seedMovements, dashboardSummary: seedSummary, siteTimeline: seedTimeline, workers: seedWorkers, settings: { allowNegativeStock: false } };
const clone = <T,>(v: T): T => JSON.parse(JSON.stringify(v)) as T;
const delay = async () => new Promise((r) => setTimeout(r, 180));

function readState(): DemoState { if (typeof window === 'undefined') return clone(seedState); const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return clone(seedState); try { return { ...clone(seedState), ...(JSON.parse(raw) as Partial<DemoState>) }; } catch { return clone(seedState); } }
function writeState(state: DemoState) { if (typeof window !== 'undefined') localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); }

export async function getDemoState() { await delay(); return readState(); }
export async function updateDemoState(updater: (s: DemoState) => DemoState) { await delay(); const next = updater(readState()); writeState(next); return next; }
export async function resetDemoState() { const reset = clone(seedState); writeState(reset); return reset; }

export async function addItem(item: Omit<ItemRecord, 'id'>) { return updateDemoState((s) => ({ ...s, items: [{ ...item, id: `itm-${Date.now()}` }, ...s.items] })); }
export async function updateItem(id: string, patch: Partial<ItemRecord>) { return updateDemoState((s) => ({ ...s, items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)) })); }
export async function addWarehouse(warehouse: Omit<WarehouseRecord, 'id'>) { return updateDemoState((s) => ({ ...s, warehouses: [{ ...warehouse, id: `wh-${Date.now()}` }, ...s.warehouses] })); }
export async function addProject(project: Omit<ProjectRecord, 'id'>) { return updateDemoState((s) => ({ ...s, projects: [{ ...project, id: `prj-${Date.now()}` }, ...s.projects] })); }
export async function createMaterialRequest(req: Omit<MaterialRequestRecord, 'id' | 'number' | 'status'>) { return updateDemoState((s) => ({ ...s, materialRequests: [{ ...req, id: `mr-${Date.now()}`, number: `MR-${new Date().getFullYear()}-${String(s.materialRequests.length + 1).padStart(4, '0')}`, status: 'SUBMITTED' }, ...s.materialRequests] })); }
export async function approveMaterialRequest(id: string) { return updateDemoState((s) => ({ ...s, materialRequests: s.materialRequests.map((r) => (r.id === id ? { ...r, status: 'APPROVED', approvedBy: 'Manager' } : r)) })); }
export async function rejectMaterialRequest(id: string) { return updateDemoState((s) => ({ ...s, materialRequests: s.materialRequests.map((r) => (r.id === id ? { ...r, status: 'REJECTED' } : r)) })); }
export async function checkoutTool(id: string) { return updateDemoState((s) => ({ ...s, toolCheckouts: s.toolCheckouts.map((t) => (t.id === id ? { ...t, status: 'CHECKED_OUT' } : t)) })); }
export async function returnTool(id: string) { return updateDemoState((s) => ({ ...s, toolCheckouts: s.toolCheckouts.map((t) => (t.id === id ? { ...t, status: 'RETURNED', conditionIn: 'Returned good' } : t)) })); }

export function getRuntimeModeLabel() { return import.meta.env.VITE_ENABLE_MOCKS !== 'false' ? 'Demo Data' : 'Live API'; }
export function getRuntimeWarning() { if (typeof window === 'undefined') return null; return sessionStorage.getItem('homex_api_warning'); }
export function setRuntimeWarning(m: string | null) { if (typeof window === 'undefined') return; if (m) sessionStorage.setItem('homex_api_warning', m); else sessionStorage.removeItem('homex_api_warning'); }
