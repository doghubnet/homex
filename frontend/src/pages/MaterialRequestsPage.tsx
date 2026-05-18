import { useMemo, useState } from 'react';
import { Button } from '../components/ui/Button';
import { ConfirmDialog } from '../components/ui/ConfirmDialog';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Drawer } from '../components/ui/Drawer';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Toast } from '../components/ui/Toast';
import { useDemoStore } from '../hooks/useDemoStore';
import { useToast } from '../hooks/useToast';
import { approveMaterialRequest, createMaterialRequest, rejectMaterialRequest } from '../services/mockStore';
import type { MaterialRequestRecord } from '../services/mockData';

export function MaterialRequestsPage() {
  const { state, reload } = useDemoStore();
  const { toast, showSuccess, clear } = useToast();
  const [tab, setTab] = useState('ALL');
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<MaterialRequestRecord | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const rows = useMemo(() => (state?.materialRequests ?? []).filter((r) => tab === 'ALL' || r.status === tab), [state, tab]);

  const cols: Array<Column<MaterialRequestRecord>> = [
    { key: 'num', header: 'Request', render: (r) => <button className='font-bold text-orange-700' onClick={() => setView(r)}>{r.number}</button> },
    { key: 'project', header: 'Project', render: (r) => r.project },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: 'Actions', render: (r) => <div className='flex gap-2'><Button variant='ghost' onClick={async () => { await approveMaterialRequest(r.id); showSuccess('Approved request.'); void reload(); }}>Approve</Button><Button variant='danger' onClick={() => setRejectId(r.id)}>Reject</Button></div> },
  ];

  return <div className='space-y-6'>
    <PageHeader eyebrow='Material Requests' title='Approval and issue flow' description='Create, approve, reject and issue material requests.' actions={<Button onClick={() => setOpen(true)}>Create Request</Button>} />
    <div className='flex flex-wrap gap-2'>{['ALL', 'SUBMITTED', 'APPROVED', 'PARTIALLY_ISSUED', 'ISSUED', 'REJECTED'].map((s) => <Button key={s} variant={tab === s ? 'primary' : 'ghost'} onClick={() => setTab(s)}>{s}</Button>)}</div>
    <DataTable columns={cols} data={rows} getRowKey={(r) => r.id} />
    <Modal open={open} title='Create Material Request' onClose={() => setOpen(false)}><Button onClick={async () => { await createMaterialRequest({ project: 'Bole Residential Villa', phase: 'Structure', requestedBy: 'Site Engineer', neededDate: new Date().toISOString().slice(0, 10), priority: 'NORMAL', reason: 'Demo request', lines: [{ item: 'Rebar 12mm', quantity: 40, unit: 'm' }] }); setOpen(false); showSuccess('Material request created.'); void reload(); }}>Submit request</Button></Modal>
    <Drawer open={Boolean(view)} title={view?.number ?? ''} onClose={() => setView(null)}>{view ? <div className='space-y-2 text-sm'><p><b>Requested by:</b> {view.requestedBy}</p><p><b>Reason:</b> {view.reason}</p><p><b>Lines:</b> {view.lines.map((l) => `${l.item} (${l.quantity} ${l.unit})`).join(', ')}</p></div> : null}</Drawer>
    <ConfirmDialog open={Boolean(rejectId)} title='Reject request?' message='This action marks the material request as rejected.' onCancel={() => setRejectId(null)} onConfirm={async () => { if (!rejectId) return; await rejectMaterialRequest(rejectId); setRejectId(null); showSuccess('Rejected request.'); void reload(); }} />
    <Toast message={toast} onClose={clear} />
  </div>;
}
