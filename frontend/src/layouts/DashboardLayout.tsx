import { NavLink, Outlet } from 'react-router-dom';
import { Box, ClipboardList, LayoutDashboard, MapPinned, Package } from 'lucide-react';

const navigation = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/items', label: 'Items', icon: Package },
  { to: '/warehouses', label: 'Warehouses', icon: Box },
  { to: '/projects', label: 'Projects', icon: MapPinned },
  { to: '/stock/entries', label: 'Stock Entries', icon: ClipboardList },
];

export function DashboardLayout() {
  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-stone-200 bg-slate-950 text-white lg:block">
        <div className="border-b border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">Home-X</p>
          <h1 className="mt-2 text-xl font-bold">Construction Inventory</h1>
        </div>
        <nav className="space-y-2 p-4">
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
              <h2 className="text-lg font-bold text-slate-950">Inventory and Resource Control</h2>
            </div>
            <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-semibold text-green-700">Phase 1 Foundation</div>
          </div>
        </header>
        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
