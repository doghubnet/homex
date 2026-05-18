interface BadgeProps {
  children: string;
  tone?: 'slate' | 'orange' | 'green' | 'red' | 'blue' | 'amber';
}

const tones = {
  slate: 'bg-slate-100 text-slate-700 ring-slate-200',
  orange: 'bg-orange-100 text-orange-800 ring-orange-200',
  green: 'bg-green-100 text-green-800 ring-green-200',
  red: 'bg-red-100 text-red-800 ring-red-200',
  blue: 'bg-blue-100 text-blue-800 ring-blue-200',
  amber: 'bg-amber-100 text-amber-800 ring-amber-200',
};

export function Badge({ children, tone = 'slate' }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${tones[tone]}`}>{children}</span>;
}
