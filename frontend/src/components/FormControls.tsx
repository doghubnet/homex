import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:ring-2" {...props} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:ring-2" {...props} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="w-full rounded-xl border border-stone-300 bg-white px-3 py-2.5 text-sm outline-none ring-orange-500 transition focus:ring-2" {...props} />;
}

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="grid gap-1.5 text-sm font-bold text-slate-700"><span>{label}</span>{children}</label>;
}
