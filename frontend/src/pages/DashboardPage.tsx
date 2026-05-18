import { AlertTriangle, Boxes, ClipboardList, Construction, Fuel, PackageCheck, Pickaxe, WalletCards } from 'lucide-react';
import { Card } from '../components/Card';
import { DataTable, type Column } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { dashboardSummary, items, materialRequests, projects, recentMovements, siteTimeline, type StockMovementRecord } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

const movementColumns: Array<Column<StockMovementRecord>> = [
  { key: 'type', header: 'Movement', render: (row) => <StatusBadge status={row.type} /> },
  { key: 'item', header: 'Item', render: (row) => <span className="font-bold text-slate-900">{row.item}</span> },
  { key: 'qty', header: 'Qty', render: (row) => `${row.quantity} ${row.unit}` },
  { key: 'route', header: 'Route / Project', render: (row) => <span>{row.from ? `${row.from} → ` : ''}{row.to ?? row.project}{row.phase ? ` / ${row.phase}` : ''}</span> },
  { key: 'value', header: 'Value', render: (row) => formatCurrency(row.value) },
  { key: 'time', header: 'Time', render: (row) => row.time },
];

export function DashboardPage() {
  const lowStock = items.filter((item) => item.status !== 'OK');

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Operational Command Center"
        title="Construction inventory from main store to project phase."
        description="Monitor stock value, low-stock risk, tool responsibility, fuel cost, damage/loss, and project material usage while the backend can remain offline in demo mode."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total stock value" value={formatCurrency(dashboardSummary.totalStockValue)} detail="Weighted-average valuation across warehouses" icon={<WalletCards />} />
        <StatCard title="Active projects" value={String(dashboardSummary.activeProjects)} detail="Bole, Summit, Ayat construction jobs" icon={<Pickaxe />} tone="orange" />
        <StatCard title="Pending requests" value={String(dashboardSummary.pendingMaterialRequests)} detail="Material requests awaiting action" icon={<ClipboardList />} />
        <StatCard title="Low-stock items" value={String(dashboardSummary.lowStockItems)} detail="Requires procurement or transfer" icon={<AlertTriangle />} tone="red" />
        <StatCard title="Tools checked out" value={String(dashboardSummary.toolsCheckedOut)} detail="Assigned to workers and teams" icon={<Construction />} />
        <StatCard title="Fuel cost this month" value={formatCurrency(dashboardSummary.fuelCostThisMonth)} detail="Diesel issued to equipment logs" icon={<Fuel />} tone="orange" />
        <StatCard title="Damage / loss" value={String(dashboardSummary.damageLossCount)} detail="Evidence and approval required" icon={<Boxes />} tone="red" />
        <StatCard title="Consumed today" value={`${dashboardSummary.materialsConsumedToday} lines`} detail="Posted to project phases" icon={<PackageCheck />} tone="green" />
      </div>

      <div className="grid gap-4 xl:grid-cols-[1.4fr_0.8fr]">
        <Card title="Recent stock movements">
          <DataTable columns={movementColumns} data={recentMovements} getRowKey={(row) => row.id} />
        </Card>
        <Card title="Pending approvals">
          <div className="space-y-3">
            {materialRequests.map((request) => (
              <div key={request.id} className="rounded-xl border border-stone-200 p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-black text-slate-950">{request.number}</p>
                    <p className="text-sm text-slate-600">{request.project} / {request.phase}</p>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <p className="mt-2 text-sm text-slate-600">{request.reason}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Low-stock alerts">
          <div className="space-y-3">
            {lowStock.map((item) => (
              <div key={item.id} className="flex items-center justify-between rounded-xl bg-stone-50 p-3">
                <div><p className="font-bold">{item.name}</p><p className="text-xs text-slate-500">{item.totalStock} {item.unit} on hand / min {item.lowStockThreshold}</p></div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Card>
        <Card title="Active project cost usage">
          <div className="space-y-4">
            {projects.map((project) => {
              const percent = Math.round((project.materialBudgetUsed / project.budget) * 100);
              return <div key={project.id}><div className="flex justify-between text-sm"><span className="font-bold">{project.name}</span><span>{percent}%</span></div><div className="mt-2 h-2 rounded-full bg-stone-200"><div className="h-2 rounded-full bg-orange-500" style={{ width: `${percent}%` }} /></div></div>;
            })}
          </div>
        </Card>
        <Card title="Site activity timeline">
          <ol className="space-y-3 border-l-2 border-orange-200 pl-4">
            {siteTimeline.map((event) => <li key={event} className="text-sm text-slate-700 before:-ml-[21px] before:mr-3 before:inline-block before:h-3 before:w-3 before:rounded-full before:bg-orange-500">{event}</li>)}
          </ol>
        </Card>
      </div>
    </div>
  );
}
