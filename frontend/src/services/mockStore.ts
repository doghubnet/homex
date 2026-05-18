import {
  dashboardSummary as seedDashboardSummary,
  equipment as seedEquipment,
  items as seedItems,
  materialRequests as seedMaterialRequests,
  projects as seedProjects,
  recentMovements as seedRecentMovements,
  siteTimeline as seedSiteTimeline,
  toolCheckouts as seedToolCheckouts,
  warehouses as seedWarehouses,
  workers as seedWorkers,
  type EquipmentRecord,
  type ItemRecord,
  type MaterialRequestRecord,
  type ProjectRecord,
  type StockMovementRecord,
  type WarehouseRecord,
} from './mockData';

const STORAGE_KEY = 'homex_demo_state_v1';

export interface DemoState {
  items: ItemRecord[];
  warehouses: WarehouseRecord[];
  projects: ProjectRecord[];
  materialRequests: MaterialRequestRecord[];
  toolCheckouts: typeof seedToolCheckouts;
  equipment: EquipmentRecord[];
  recentMovements: StockMovementRecord[];
  dashboardSummary: typeof seedDashboardSummary;
  siteTimeline: string[];
  workers: string[];
}

const seedState: DemoState = {
  items: seedItems,
  warehouses: seedWarehouses,
  projects: seedProjects,
  materialRequests: seedMaterialRequests,
  toolCheckouts: seedToolCheckouts,
  equipment: seedEquipment,
  recentMovements: seedRecentMovements,
  dashboardSummary: seedDashboardSummary,
  siteTimeline: seedSiteTimeline,
  workers: seedWorkers,
};

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

function readState(): DemoState {
  if (typeof window === 'undefined') {
    return deepClone(seedState);
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return deepClone(seedState);
  try {
    return { ...deepClone(seedState), ...(JSON.parse(raw) as Partial<DemoState>) };
  } catch {
    return deepClone(seedState);
  }
}

function writeState(state: DemoState) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

async function delay() {
  await new Promise((resolve) => setTimeout(resolve, 220));
}

export function getRuntimeModeLabel() {
  const mocksEnabled = import.meta.env.VITE_ENABLE_MOCKS !== 'false';
  return mocksEnabled ? 'Demo Data' : 'Live API';
}

export function getRuntimeWarning() {
  if (typeof window === 'undefined') return null;
  return window.sessionStorage.getItem('homex_api_warning');
}

export function setRuntimeWarning(message: string | null) {
  if (typeof window === 'undefined') return;
  if (message) window.sessionStorage.setItem('homex_api_warning', message);
  else window.sessionStorage.removeItem('homex_api_warning');
}

export async function getDemoState() {
  await delay();
  return readState();
}

export async function updateDemoState(updater: (state: DemoState) => DemoState) {
  await delay();
  const next = updater(readState());
  writeState(next);
  return next;
}

export async function resetDemoState() {
  await delay();
  const reset = deepClone(seedState);
  writeState(reset);
  return reset;
}
