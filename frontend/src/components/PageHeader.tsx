import type { ReactNode } from 'react';
import { Badge } from './Badge';

interface PageHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  demo?: boolean;
}

export function PageHeader({ eyebrow, title, description, actions, demo = true }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-600">{eyebrow}</p>
          {demo ? <Badge tone="orange">Demo Data</Badge> : null}
        </div>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">{description}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}
