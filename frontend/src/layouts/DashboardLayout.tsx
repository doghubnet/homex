import { NavLink, Outlet } from 'react-router-dom';
import { BarChart3, Box, ClipboardCheck, ClipboardList, Construction, Fuel, LayoutDashboard, MapPinned, Menu, Package, Settings, ShieldCheck, Truck, Wifi, WifiOff, X } from 'lucide-react';
import { useState } from 'react';
import { APP_NAME, MOCKS_ENABLED } from '../services/api';
import { Badge } from '../components/Badge';
import { getRuntimeWarning, getRuntimeModeLabel } from '../services/mockStore';

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
  const [open, setOpen] = useState(false);
  const runtimeWarning = getRuntimeWarning();
  const navClass = 'space-y-1 p-4';

  const nav = (
    <nav className={navClass}>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} onClick={() => setOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-950/30' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}>
            <Icon size={18} />{item.label}
          </NavLink>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-stone-100 text-slate-900">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-slate-800 bg-slate-950 text-white lg:block">
        <div className="border-b border-white/10 p-6"><p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-400">Home-X</p><h1 className="mt-2 text-xl font-bold">{APP_NAME}</h1><div className="mt-4 flex items-center gap-2 text-xs text-slate-300"><ShieldCheck size={16} /> Ledger-first construction control</div></div>
        {nav}
      </aside>

      {open ? <div className="fixed inset-0 z-40 bg-slate-900/60 lg:hidden" onClick={() => setOpen(false)} /> : null}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 border-r border-slate-800 bg-slate-950 text-white transition-transform lg:hidden ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between border-b border-white/10 p-6"><h1 className="text-xl font-bold">{APP_NAME}</h1><button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-300 hover:bg-white/10"><X size={18} /></button></div>
        {nav}
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-10 border-b border-stone-200 bg-white/90 px-4 py-4 backdrop-blur md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button type="button" className="rounded-lg border border-stone-200 p-2 lg:hidden" onClick={() => setOpen(true)}><Menu size={18} /></button>
              <div><p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">Home-X Construction PLC</p><h2 className="text-lg font-bold text-slate-950">Inventory, Resources, Tools, Equipment and Project Cost</h2></div>
            </div>
            <div className="flex items-center gap-2">
              {MOCKS_ENABLED ? <Badge tone="orange">{getRuntimeModeLabel()}</Badge> : <Badge tone="green">{getRuntimeModeLabel()}</Badge>}
              {runtimeWarning ? <Badge tone="red">Offline API fallback</Badge> : <Badge tone="green">Live API online</Badge>}
              <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 md:flex"><Truck size={16} /> Main Store Online</div>
            </div>
          </div>
          {runtimeWarning ? <div className="mt-3 flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700"><WifiOff size={14} /> {runtimeWarning}</div> : <div className="mt-3 hidden items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 md:flex"><Wifi size={14} /> API communication healthy for current mode.</div>}
        </header>
        <main className="p-4 md:p-8"><Outlet /></main>
      </div>
    </div>
  );
}
