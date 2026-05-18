import type { ReactNode } from 'react';

interface CardProps {
  title: string;
  value?: string;
  children?: ReactNode;
}

export function Card({ title, value, children }: CardProps) {
  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      {value ? <p className="mt-3 text-3xl font-bold text-slate-950">{value}</p> : null}
      {children ? <div className="mt-4">{children}</div> : null}
    </section>
  );
}
