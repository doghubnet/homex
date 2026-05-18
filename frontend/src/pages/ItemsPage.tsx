import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Drawer } from '../components/ui/Drawer';
import { FormField } from '../components/ui/FormField';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Select';
import { StatusBadge } from '../components/ui/StatusBadge';
import { Toast } from '../components/ui/Toast';
import { useDemoStore } from '../hooks/useDemoStore';
import { useToast } from '../hooks/useToast';
import { addItem, updateItem } from '../services/mockStore';
import type { ItemRecord } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

export function ItemsPage() {
  const { state, reload } = useDemoStore();
  const { toast, showSuccess, clear } = useToast();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ItemRecord | null>(null);
  const [q, setQ] = useState('');
  const [type, setType] = useState('ALL');

  const rows = useMemo(() => (state?.items ?? []).filter((i) => (`${i.code} ${i.name} ${i.category} ${i.qrCode}`.toLowerCase().includes(q.toLowerCase()) && (type === 'ALL' || i.type === type))), [state, q, type]);

  async function onCreate() {
    await addItem({ code: `NEW-${Date.now()}`, name: 'New Demo Item', type: 'MATERIAL', category: 'General', unit: 'pcs', totalStock: 0, lowStockThreshold: 10, valuation: 0, qrCode: `HX-QR-${Date.now()}`, warehouse: 'Main Store', status: 'LOW' });
    setOpen(false); showSuccess('Item added.'); void reload();
  }

  const columns: Array<Column<ItemRecord>> = [
    { key: 'code', header: 'Code', render: (r) => r.code },
    { key: 'name', header: 'Name', render: (r) => <button className='font-bold text-orange-700' onClick={() => setSelected(r)}>{r.name}</button> },
    { key: 'type', header: 'Type', render: (r) => <Badge tone='blue'>{r.type}</Badge> },
    { key: 'stock', header: 'Stock', render: (r) => `${r.totalStock} ${r.unit}` },
    { key: 'value', header: 'Valuation', render: (r) => formatCurrency(r.valuation) },
    { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'actions', header: 'Actions', render: (r) => <Button variant='ghost' onClick={async () => { await updateItem(r.id, { status: r.status === 'OK' ? 'LOW' : 'OK' }); showSuccess('Item updated.'); void reload(); }}>Toggle status</Button> },
  ];

  return <div className='space-y-6'>
    <PageHeader eyebrow='Master Data' title='Items' description='Construction item management with QR labels and stock visibility.' actions={<Button onClick={() => setOpen(true)}>Add Item</Button>} />
    <div className='grid gap-3 md:grid-cols-3'><Input placeholder='Search code, name, QR' value={q} onChange={(e) => setQ(e.target.value)} /><Select value={type} onChange={(e) => setType(e.target.value)}><option>ALL</option><option>MATERIAL</option><option>TOOL</option><option>EQUIPMENT</option><option>PPE</option><option>FUEL</option><option>CONSUMABLE</option></Select></div>
    <DataTable columns={columns} data={rows} getRowKey={(r) => r.id} />
    <Modal open={open} title='Add Item' onClose={() => setOpen(false)}><FormField label='Creates a new demo row'><Button onClick={onCreate}>Create</Button></FormField></Modal>
    <Drawer open={Boolean(selected)} title={selected?.name ?? 'Item'} onClose={() => setSelected(null)}>{selected ? <div className='space-y-2 text-sm'><p><b>Code:</b> {selected.code}</p><p><b>QR:</b> {selected.qrCode}</p><p><b>Category:</b> {selected.category}</p><p><b>Preferred supplier:</b> Addis Construction Materials Supplier</p><Button variant='ghost' onClick={() => window.print()}>Print label</Button></div> : null}</Drawer>
    <Toast message={toast} onClose={clear} />
  </div>;
}
