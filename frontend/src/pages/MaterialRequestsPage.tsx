import { useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataTable, type Column } from '../components/DataTable';
import { Field, Input, Select, TextArea } from '../components/FormControls';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { materialRequests, type MaterialRequestRecord } from '../services/mockData';

const columns: Array<Column<MaterialRequestRecord>> = [
  { key: 'number', header: 'Request', render: (row) => <span className="font-black text-slate-950">{row.number}</span> },
  { key: 'project', header: 'Project / phase', render: (row) => <span>{row.project}<br /><span className="text-xs text-slate-500">{row.phase}</span></span> },
  { key: 'needed', header: 'Needed', render: (row) => row.neededDate },
  { key: 'priority', header: 'Priority', render: (row) => <StatusBadge status={row.priority} /> },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'lines', header: 'Lines', render: (row) => row.lines.map((line) => `${line.item} (${line.quantity} ${line.unit})`).join(', ') },
  { key: 'actions', header: 'Actions', render: (row) => <div className="flex flex-wrap gap-2"><Button variant="ghost">Approve</Button><Button variant="danger">Reject</Button>{row.status === 'APPROVED' ? <Button>Issue</Button> : null}</div> },
];

export function MaterialRequestsPage() {
  const [status, setStatus] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);
  const filtered = status === 'ALL' ? materialRequests : materialRequests.filter((request) => request.status === status);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Material Workflow" title="Requests, approvals and issue conversion" description="Site engineers request material by project phase; managers approve or reject; storekeepers convert approvals to stock issues." actions={<Button onClick={() => setModalOpen(true)}>Create request</Button>} />
      <Card title="Status tabs"><div className="flex flex-wrap gap-2">{['ALL', 'SUBMITTED', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED'].map((tab) => <Button key={tab} variant={status === tab ? 'primary' : 'ghost'} onClick={() => setStatus(tab)}>{tab.replace(/_/g, ' ')}</Button>)}</div></Card>
      <DataTable columns={columns} data={filtered} getRowKey={(row) => row.id} />
      <Modal open={modalOpen} title="Create material request" onClose={() => setModalOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2"><Field label="Project"><Select><option>Bole Residential Villa</option><option>Summit Warehouse Extension</option></Select></Field><Field label="Phase"><Select><option>Foundation</option><option>Structure</option><option>Electrical</option></Select></Field><Field label="Needed date"><Input type="date" /></Field><Field label="Priority"><Select><option>NORMAL</option><option>HIGH</option><option>URGENT</option></Select></Field></div>
        <div className="mt-4"><Field label="Reason"><TextArea rows={4} placeholder="Explain construction activity and materials required." /></Field></div>
      </Modal>
    </div>
  );
}
