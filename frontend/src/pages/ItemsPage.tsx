import { useMemo, useState } from 'react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataTable, type Column } from '../components/DataTable';
import { Field, Input, Select } from '../components/FormControls';
import { Modal } from '../components/Modal';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { items, type ItemRecord } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

const columns: Array<Column<ItemRecord>> = [
  { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs font-bold">{row.code}</span> },
  { key: 'name', header: 'Name', render: (row) => <span className="font-bold text-slate-950">{row.name}</span> },
  { key: 'type', header: 'Type', render: (row) => <Badge tone="blue">{row.type}</Badge> },
  { key: 'category', header: 'Category', render: (row) => row.category },
  { key: 'stock', header: 'Stock', render: (row) => `${row.totalStock} ${row.unit}` },
  { key: 'threshold', header: 'Low threshold', render: (row) => `${row.lowStockThreshold} ${row.unit}` },
  { key: 'valuation', header: 'Valuation', render: (row) => formatCurrency(row.valuation) },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
  { key: 'qr', header: 'QR', render: (row) => <span className="rounded bg-slate-100 px-2 py-1 font-mono text-xs">{row.qrCode}</span> },
];

export function ItemsPage() {
  const [query, setQuery] = useState('');
  const [type, setType] = useState('ALL');
  const [stockStatus, setStockStatus] = useState('ALL');
  const [modalOpen, setModalOpen] = useState(false);

  const filteredItems = useMemo(() => items.filter((item) => {
    const matchesQuery = `${item.code} ${item.name} ${item.category}`.toLowerCase().includes(query.toLowerCase());
    const matchesType = type === 'ALL' || item.type === type;
    const matchesStatus = stockStatus === 'ALL' || item.status === stockStatus;
    return matchesQuery && matchesType && matchesStatus;
  }), [query, stockStatus, type]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Master Data" title="Items, tools, equipment, PPE and fuel" description="Search and filter construction-specific item master data with stock status, valuation, QR label value and low-stock threshold." actions={<Button onClick={() => setModalOpen(true)}>Add item</Button>} />
      <Card title="Filters">
        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Search"><Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search code, name, category" /></Field>
          <Field label="Type"><Select value={type} onChange={(event) => setType(event.target.value)}><option>ALL</option><option>MATERIAL</option><option>TOOL</option><option>EQUIPMENT</option><option>PPE</option><option>FUEL</option><option>CONSUMABLE</option></Select></Field>
          <Field label="Stock status"><Select value={stockStatus} onChange={(event) => setStockStatus(event.target.value)}><option>ALL</option><option>OK</option><option>LOW</option><option>CRITICAL</option></Select></Field>
        </div>
      </Card>
      <DataTable columns={columns} data={filteredItems} getRowKey={(row) => row.id} />
      <Modal open={modalOpen} title="Add Home-X item" onClose={() => setModalOpen(false)}>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Item code"><Input placeholder="MAT-CEM-OPC-002" /></Field>
          <Field label="Item name"><Input placeholder="Construction material name" /></Field>
          <Field label="Type"><Select><option>MATERIAL</option><option>TOOL</option><option>EQUIPMENT</option><option>PPE</option><option>FUEL</option></Select></Field>
          <Field label="Low-stock threshold"><Input type="number" placeholder="100" /></Field>
        </div>
        <p className="mt-4 rounded-xl bg-orange-50 p-4 text-sm text-orange-900">Phase 2 backend APIs will persist this form. Demo mode keeps Vercel deploys usable without a backend.</p>
      </Modal>
    </div>
  );
}
