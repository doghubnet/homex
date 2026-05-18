export function ItemsPage() {
  return <Placeholder title="Items" description="Material, tool, equipment, PPE, fuel, and consumable master data foundation." />;
}

function Placeholder({ title, description }: { title: string; description: string }) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
      <p className="mt-2 text-slate-600">{description}</p>
    </section>
  );
}
