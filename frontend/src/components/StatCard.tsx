import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string;
  detail: string;
  icon?: ReactNode;
  tone?: 'navy' | 'orange' | 'green' | 'red';
}

const tones = {
  navy: 'bg-slate-950 text-white',
  orange: 'bg-orange-500 text-white',
  green: 'bg-green-600 text-white',
  red: 'bg-red-600 text-white',
};

export function StatCard({ title, value, detail, icon, tone = 'navy' }: StatCardProps) {
  return (
    <section className={`rounded-2xl p-5 shadow-sm ${tones[tone]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold opacity-80">{title}</p>
          <p className="mt-3 text-3xl font-black tracking-tight">{value}</p>
        </div>
        {icon ? <div className="rounded-xl bg-white/15 p-2">{icon}</div> : null}
      </div>
      <p className="mt-4 text-sm font-medium opacity-80">{detail}</p>
    </section>
  );
}
