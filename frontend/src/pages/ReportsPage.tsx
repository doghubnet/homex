import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';
import { projects, reportCards, warehouses } from '../services/mockData';

export function ReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Management Reports" title="Export construction inventory and cost reports" description="Use date, project and warehouse filters to review stock balance, movement history, project consumption, tools, fuel, damage/loss and audit logs." />
      <Card title="Report filters"><div className="grid gap-4 md:grid-cols-4"><Field label="From"><Input type="date" /></Field><Field label="To"><Input type="date" /></Field><Field label="Project"><Select><option>All projects</option>{projects.map((project) => <option key={project.id}>{project.name}</option>)}</Select></Field><Field label="Warehouse"><Select><option>All warehouses</option>{warehouses.map((warehouse) => <option key={warehouse.id}>{warehouse.name}</option>)}</Select></Field></div></Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{reportCards.map((report) => <section key={report.title} className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm"><p className="text-sm font-bold text-orange-600">{report.metric}</p><h2 className="mt-2 text-lg font-black text-slate-950">{report.title}</h2><p className="mt-2 min-h-12 text-sm text-slate-600">{report.description}</p><Button className="mt-4" variant="ghost">Export {report.exportName}</Button></section>)}</div>
    </div>
  );
}
