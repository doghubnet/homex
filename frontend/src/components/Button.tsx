import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
}

const variants = {
  primary: 'bg-orange-500 text-white hover:bg-orange-600 shadow-sm shadow-orange-900/20',
  secondary: 'bg-slate-900 text-white hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  ghost: 'bg-white text-slate-700 ring-1 ring-stone-200 hover:bg-stone-50',
};

export function Button({ children, variant = 'primary', className = '', ...props }: ButtonProps) {
  return (
    <button className={`inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}
