import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataTable, type Column } from '../components/DataTable';
import { Field, Input, Select, TextArea } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { toolCheckouts, workers, type ToolCheckoutRecord } from '../services/mockData';

const columns: Array<Column<ToolCheckoutRecord>> = [
  { key: 'code', header: 'Tool', render: (row) => <span className="font-bold">{row.tool}<br /><span className="font-mono text-xs text-slate-500">{row.code}</span></span> },
  { key: 'worker', header: 'Responsible', render: (row) => row.worker },
  { key: 'project', header: 'Project', render: (row) => row.project },
  { key: 'dates', header: 'Checkout / due', render: (row) => `${row.checkedOutAt} → ${row.dueAt}` },
  { key: 'condition', header: 'Condition', render: (row) => row.conditionIn ?? row.conditionOut },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'actions', header: 'Actions', render: () => <div className="flex gap-2"><Button variant="ghost">Return</Button><Button variant="danger">Damage/Loss</Button></div> },
];

export function ToolsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Tool Responsibility" title="Checkout, return and condition control" description="Track reusable tools assigned to workers and teams. Tools are not consumed unless damaged or lost." actions={<Button>Checkout tool</Button>} />
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <DataTable columns={columns} data={toolCheckouts} getRowKey={(row) => row.id} />
        <Card title="Checkout / return form">
          <div className="grid gap-3"><Field label="Tool"><Select><option>Angle Grinder</option><option>Drill Machine</option></Select></Field><Field label="Worker or team"><Select>{workers.map((worker) => <option key={worker}>{worker}</option>)}</Select></Field><Field label="Expected return"><Input type="date" /></Field><Field label="Condition out / in"><TextArea rows={3} placeholder="Good, damaged cable, missing guard..." /></Field><Button>Record checkout</Button></div>
        </Card>
      </div>
    </div>
  );
}
