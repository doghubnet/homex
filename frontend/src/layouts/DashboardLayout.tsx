import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Box, ClipboardCheck, ClipboardList, Construction, Fuel, LayoutDashboard, MapPinned, Package, Settings, ShieldCheck, Truck } from 'lucide-react';
import { APP_NAME, MOCKS_ENABLED } from '../services/api';
import { Badge } from '../components/Badge';

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/items', label: 'Items', icon: Package },
  { to: '/warehouses', label: 'Warehouses', icon: Box },
  { to: '/projects', label: 'Projects', icon: MapPinned },
  { to: '/stock/entries', label: 'Stock Entries', icon: ClipboardList },
  { to: '/material-requests', label: 'Material Requests', icon: ClipboardCheck },
  { to: '/tools', label: 'Tools', icon: Construction },
  { to: '/equipment', label: 'Equipment & Fuel', icon: Fuel },
  { to: '/reports', label: 'Reports', icon: BarChart3 },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950 text-white lg:block">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">Home-X</p>
          <h1 className="mt-2 text-xl font-bold">{APP_NAME}</h1>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-300"><ShieldCheck size={16} /> Ledger-first construction control</div>
        </div>
        <nav className="space-y-1 p-4">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Home-X Construction PLC</p>
              <h2 className="text-lg font-bold text-slate-950">Inventory, Resources, Tools, Equipment and Project Cost</h2>
            </div>
            <div className="flex items-center gap-2">
              {MOCKS_ENABLED ? <Badge tone="orange">Demo Data</Badge> : null}
              <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 md:flex"><Truck size={16} /> Main Store Online</div>
            </div>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
