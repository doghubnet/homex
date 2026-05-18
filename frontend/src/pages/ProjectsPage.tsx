import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { projects } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

export function ProjectsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Projects and Sites" title="Project material budgets and phase consumption" description="Monitor construction phase budgets, assigned engineers, site stores, and material cost usage." actions={<Button>New project</Button>} />
      <div className="grid gap-4 xl:grid-cols-3">
        {projects.map((project) => {
          const percent = Math.round((project.materialBudgetUsed / project.budget) * 100);
          return (
            <section key={project.id} className="rounded-3xl border border-stone-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between gap-3"><div><p className="font-mono text-xs font-bold text-slate-500">{project.code}</p><h2 className="mt-1 text-xl font-black text-slate-950">{project.name}</h2></div><StatusBadge status={project.status} /></div>
              <p className="mt-3 text-sm text-slate-600">Site: {project.site}</p>
              <div className="mt-5"><div className="flex justify-between text-sm"><span className="font-bold">Material budget used</span><span>{percent}%</span></div><div className="mt-2 h-3 rounded-full bg-stone-200"><div className="h-3 rounded-full bg-orange-500" style={{ width: `${percent}%` }} /></div><p className="mt-2 text-sm text-slate-600">{formatCurrency(project.materialBudgetUsed)} of {formatCurrency(project.budget)}</p></div>
              <div className="mt-5 space-y-2">{project.phases.map((phase) => <div key={phase.name} className="rounded-xl bg-stone-50 p-3"><div className="flex justify-between text-sm"><span className="font-bold">{phase.name}</span><span>{formatCurrency(phase.used)}</span></div></div>)}</div>
              <Button className="mt-5 w-full" variant="ghost">Open detail drawer</Button>
            </section>
          );
        })}
      </div>
      <Card title="Project controls note"><p className="text-sm text-slate-600">Phase 2 stock issues will write ledger rows with projectId and projectPhaseId so project material cost reports can be derived from immutable movements.</p></Card>
    </div>
  );
}
