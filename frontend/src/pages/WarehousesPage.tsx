import { useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { DataTable, type Column } from '../components/ui/DataTable';
import { Drawer } from '../components/ui/Drawer';
import { Input } from '../components/ui/Input';
import { Modal } from '../components/ui/Modal';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Select';
import { Toast } from '../components/ui/Toast';
import { useDemoStore } from '../hooks/useDemoStore';
import { useToast } from '../hooks/useToast';
import { addWarehouse } from '../services/mockStore';
import type { WarehouseRecord } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

export function WarehousesPage() {
  const { state, reload } = useDemoStore();
  const { toast, showSuccess, clear } = useToast();
  const [type, setType] = useState('ALL');
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WarehouseRecord | null>(null);
  const rows = useMemo(() => (state?.warehouses ?? []).filter((w) => type === 'ALL' || w.type === type), [state, type]);
  const cols: Array<Column<WarehouseRecord>> = [
    { key: 'code', header: 'Code', render: (r) => r.code },
    { key: 'name', header: 'Name', render: (r) => <button className='font-bold text-orange-700' onClick={() => setSelected(r)}>{r.name}</button> },
    { key: 'type', header: 'Type', render: (r) => <Badge tone='blue'>{r.type}</Badge> },
    { key: 'value', header: 'Value', render: (r) => formatCurrency(r.stockValue) },
  ];

  return <div className='space-y-6'>
    <PageHeader eyebrow='Warehouses' title='Storage and site locations' description='View stock and movement by location.' actions={<Button onClick={() => setOpen(true)}>New Warehouse</Button>} />
    <div className='max-w-xs'><Select value={type} onChange={(e) => setType(e.target.value)}><option>ALL</option><option>MAIN_STORE</option><option>PROJECT_SITE</option><option>TRUCK</option><option>TRANSIT</option><option>DAMAGED</option></Select></div>
    <DataTable columns={cols} data={rows} getRowKey={(r) => r.id} />
    <Modal open={open} title='New Warehouse' onClose={() => setOpen(false)}><Input placeholder='Name' /><Button className='mt-3' onClick={async () => { await addWarehouse({ code: `HX-WH-${Date.now()}`, name: 'New Warehouse', type: 'TRANSIT', location: 'Temporary', responsible: 'Storekeeper', itemCount: 0, stockValue: 0, status: 'Operational' }); setOpen(false); showSuccess('Warehouse added.'); void reload(); }}>Create warehouse</Button></Modal>
    <Drawer open={Boolean(selected)} title={selected?.name ?? ''} onClose={() => setSelected(null)}>{selected ? <div className='space-y-2 text-sm'><p><b>Responsible:</b> {selected.responsible}</p><p><b>Location:</b> {selected.location}</p><Button variant='ghost'>Transfer to this warehouse</Button><Button variant='ghost'>Receive into this warehouse</Button></div> : null}</Drawer>
    <Toast message={toast} onClose={clear} />
  </div>;
}
