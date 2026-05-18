import { Button } from './Button';

export function ConfirmDialog({ open, title, message, onConfirm, onCancel }: { open: boolean; title: string; message: string; onConfirm: () => void; onCancel: () => void }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60"><div className="w-full max-w-md rounded-2xl bg-white p-6"><h4 className="text-lg font-black">{title}</h4><p className="mt-2 text-sm text-slate-600">{message}</p><div className="mt-4 flex gap-2"><Button variant="danger" onClick={onConfirm}>Confirm</Button><Button variant="ghost" onClick={onCancel}>Cancel</Button></div></div></div>;
}
