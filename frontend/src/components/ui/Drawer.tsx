import type { ReactNode } from 'react';

export function Drawer({ open, title, children, onClose }: { open: boolean; title: string; children: ReactNode; onClose: () => void }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/50" onClick={onClose}>
      <section className="h-full w-full max-w-xl overflow-y-auto bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between"><h3 className="text-xl font-black">{title}</h3><button onClick={onClose}>Close</button></div>
        {children}
      </section>
    </div>
  );
}
