import { Card } from '../components/Card';

const cards = [
  ['Total stock value', 'ETB 0.00'],
  ['Low stock alerts', '0'],
  ['Active projects', '1'],
  ['Pending purchase requests', '0'],
  ['Tools checked out', '0'],
  ['Damage/loss this month', '0'],
];

export function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-br from-slate-950 to-slate-800 p-6 text-white shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Operational Command Center</p>
        <h1 className="mt-3 text-3xl font-bold">Track materials, tools, equipment, and project cost from main store to site.</h1>
        <div className="mt-6 flex flex-wrap gap-3">
          {['Request Material', 'Receive Purchase', 'Transfer Stock', 'Issue to Project', 'Checkout Tool', 'Log Fuel'].map((action) => (
            <button key={action} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-orange-100">
              {action}
            </button>
          ))}
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map(([title, value]) => (
          <Card key={title} title={title} value={value} />
        ))}
      </div>
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Recent stock movements">
          <p className="rounded-xl bg-stone-50 p-4 text-sm text-slate-600">Stock ledger data will appear after Phase 2 stock entry APIs are enabled.</p>
        </Card>
        <Card title="Pending approvals">
          <p className="rounded-xl bg-stone-50 p-4 text-sm text-slate-600">Purchase and material request approvals will appear here in the workflow phase.</p>
        </Card>
      </div>
    </div>
  );
}
