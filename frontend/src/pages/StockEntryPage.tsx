import { useMemo, useState } from 'react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field, Input, Select, TextArea } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';
import { items, projects, warehouses, type MovementType } from '../services/mockData';
import { formatCurrency } from '../utils/formatCurrency';

const movementGuidance: Record<MovementType, string> = {
  PURCHASE_RECEIPT: 'Supplier delivers materials to a target warehouse, normally the main store. Ledger increases target stock.',
  MATERIAL_TRANSFER: 'Move materials from main store to project site, truck, transit, returned or another warehouse. Ledger decreases source and increases target.',
  MATERIAL_ISSUE: 'Issue material to a project phase. Ledger decreases source and records project cost.',
  RETURN_FROM_SITE: 'Return unused material from site store to main/returned warehouse. Ledger reverses location and can support cost adjustment.',
  DAMAGE: 'Record damaged or wasted stock with reason and evidence. Ledger decreases usable stock or moves to damaged store.',
  LOSS: 'Record lost or stolen stock with responsible person, approval and audit trail. Ledger decreases stock.',
};

export function StockEntryPage() {
  const [type, setType] = useState<MovementType>('PURCHASE_RECEIPT');
  const [quantity, setQuantity] = useState(100);
  const [unitCost, setUnitCost] = useState(640);
  const [itemId, setItemId] = useState(items[0].id);
  const selectedItem = items.find((item) => item.id === itemId) ?? items[0];
  const total = useMemo(() => quantity * unitCost, [quantity, unitCost]);

  const needsSource = ['MATERIAL_TRANSFER', 'MATERIAL_ISSUE', 'RETURN_FROM_SITE', 'DAMAGE', 'LOSS'].includes(type);
  const needsTarget = ['PURCHASE_RECEIPT', 'MATERIAL_TRANSFER', 'RETURN_FROM_SITE', 'DAMAGE'].includes(type);
  const needsProject = ['MATERIAL_ISSUE', 'RETURN_FROM_SITE'].includes(type);
  const needsReason = ['DAMAGE', 'LOSS'].includes(type);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Stock Operations" title="Create a ledger-backed stock entry" description="Choose the construction movement type and fill the dynamic fields for purchase receipt, transfer, project issue, return, damage or loss." />
      <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
        <section className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Movement type"><Select value={type} onChange={(event) => setType(event.target.value as MovementType)}>{Object.keys(movementGuidance).map((movement) => <option key={movement}>{movement}</option>)}</Select></Field>
            <Field label="Reference / delivery note"><Input placeholder="DN-2026-114 / TR-001" /></Field>
            {needsSource ? <Field label="Source warehouse"><Select>{warehouses.map((warehouse) => <option key={warehouse.id}>{warehouse.name}</option>)}</Select></Field> : null}
            {needsTarget ? <Field label="Target warehouse"><Select>{warehouses.map((warehouse) => <option key={warehouse.id}>{warehouse.name}</option>)}</Select></Field> : null}
            {type === 'PURCHASE_RECEIPT' ? <Field label="Supplier"><Input placeholder="Addis Construction Materials Supplier" /></Field> : null}
            {needsProject ? <Field label="Project"><Select>{projects.map((project) => <option key={project.id}>{project.name}</option>)}</Select></Field> : null}
            {needsProject ? <Field label="Project phase"><Select>{projects[0].phases.map((phase) => <option key={phase.name}>{phase.name}</option>)}</Select></Field> : null}
            {needsReason ? <Field label="Responsible person"><Input placeholder="Worker, driver, team or supervisor" /></Field> : null}
          </div>
          <div className="mt-6 rounded-2xl bg-stone-50 p-4">
            <h2 className="font-black text-slate-950">Line item</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              <Field label="Item"><Select value={itemId} onChange={(event) => setItemId(event.target.value)}>{items.map((item) => <option key={item.id} value={item.id}>{item.name}</option>)}</Select></Field>
              <Field label="Quantity"><Input min={0} type="number" value={quantity} onChange={(event) => setQuantity(Number(event.target.value))} /></Field>
              <Field label="Unit cost"><Input min={0} type="number" value={unitCost} onChange={(event) => setUnitCost(Number(event.target.value))} /></Field>
              <Field label="Estimated total"><Input readOnly value={formatCurrency(total)} /></Field>
            </div>
            <p className="mt-3 text-sm text-slate-600">Selected item: {selectedItem.code} · Available demo stock: {selectedItem.totalStock} {selectedItem.unit}</p>
          </div>
          <div className="mt-6 grid gap-4">
            <Field label={needsReason ? 'Reason and evidence notes' : 'Notes'}><TextArea rows={4} placeholder="Record requester, approver, receiver, truck, delivery note, photo reference or issue reason." /></Field>
            <div className="flex flex-wrap gap-3"><Button>Submit stock entry</Button><Button variant="ghost">Save draft</Button></div>
          </div>
        </section>
        <Card title="Movement rules"><p className="text-sm leading-6 text-slate-600">{movementGuidance[type]}</p><div className="mt-4 rounded-xl bg-orange-50 p-4 text-sm font-semibold text-orange-900">Phase 2 API will reject insufficient stock, write ledger rows first, then update cached balances in the same transaction.</div></Card>
      </div>
    </div>
  );
}
