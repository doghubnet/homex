import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataTable, type Column } from '../components/DataTable';
import { Field, Input, Select, TextArea } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { equipment, projects, type EquipmentRecord } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

const columns: Array<Column<EquipmentRecord>> = [
  { key: 'code', header: 'Equipment', render: (row) => <span className="font-bold">{row.name}<br /><span className="font-mono text-xs text-slate-500">{row.code}</span></span> },
  { key: 'project', header: 'Project/location', render: (row) => row.project },
  { key: 'operator', header: 'Operator', render: (row) => row.operator },
  { key: 'hours', header: 'Hours', render: (row) => `${row.hoursThisMonth} hr` },
  { key: 'fuel', header: 'Fuel cost', render: (row) => formatCurrency(row.fuelCost) },
  { key: 'service', header: 'Next service', render: (row) => row.nextService },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export function EquipmentPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Equipment and Fuel" title="Assignments, hours, fuel and maintenance" description="Record equipment project assignment, operators, machine hours, fuel consumption, downtime and maintenance plans." actions={<Button>Assign equipment</Button>} />
      <DataTable columns={columns} data={equipment} getRowKey={(row) => row.id} />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Fuel log form"><div className="grid gap-3 md:grid-cols-2"><Field label="Equipment"><Select>{equipment.map((item) => <option key={item.id}>{item.name}</option>)}</Select></Field><Field label="Project"><Select>{projects.map((project) => <option key={project.id}>{project.name}</option>)}</Select></Field><Field label="Liters"><Input type="number" placeholder="62" /></Field><Field label="Hour meter"><Input type="number" placeholder="126.5" /></Field><Field label="Unit cost"><Input type="number" placeholder="95" /></Field><Field label="Operator"><Input placeholder="Operator name" /></Field></div><div className="mt-3"><Button>Log fuel usage</Button></div></Card>
        <Card title="Maintenance log form"><div className="grid gap-3"><Field label="Service type"><Select><option>PREVENTIVE</option><option>CORRECTIVE</option><option>INSPECTION</option></Select></Field><Field label="Parts and labor cost"><Input type="number" /></Field><Field label="Next service date"><Input type="date" /></Field><Field label="Notes"><TextArea rows={3} placeholder="Parts used, downtime, technician, next service hour." /></Field><Button>Record maintenance</Button></div></Card>
      </div>
    </div>
  );
}
