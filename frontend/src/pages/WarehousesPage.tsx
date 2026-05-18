import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { DataTable, type Column } from '../components/DataTable';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { warehouses, type WarehouseRecord } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

const columns: Array<Column<WarehouseRecord>> = [
  { key: 'code', header: 'Code', render: (row) => <span className="font-mono text-xs font-bold">{row.code}</span> },
  { key: 'name', header: 'Warehouse', render: (row) => <span className="font-bold text-slate-950">{row.name}</span> },
  { key: 'type', header: 'Type', render: (row) => <Badge tone="blue">{row.type}</Badge> },
  { key: 'location', header: 'Location', render: (row) => row.location },
  { key: 'responsible', header: 'Responsible', render: (row) => row.responsible },
  { key: 'items', header: 'Items', render: (row) => row.itemCount },
  { key: 'value', header: 'Stock value', render: (row) => formatCurrency(row.stockValue) },
  { key: 'status', header: 'Status', render: (row) => <StatusBadge status={row.status} /> },
];

export function WarehousesPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Locations" title="Warehouses, site stores, trucks and controlled areas" description="Track exact material location across main store, project sites, transit, trucks, damaged, returned and scrap warehouses." actions={<Button>New warehouse</Button>} />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {warehouses.map((warehouse) => <Card key={warehouse.id} title={warehouse.name} value={formatCurrency(warehouse.stockValue)}><div className="flex items-center justify-between"><Badge tone="slate">{warehouse.type}</Badge><span className="text-sm font-bold text-slate-600">{warehouse.itemCount} items</span></div><p className="mt-3 text-sm text-slate-600">{warehouse.location}</p></Card>)}
      </div>
      <DataTable columns={columns} data={warehouses} getRowKey={(row) => row.id} />
    </div>
  );
}
