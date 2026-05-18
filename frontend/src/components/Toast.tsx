export interface ToastMessage {
  type: 'success' | 'error' | 'info';
  text: string;
}

export function Toast({ message, onClose }: { message: ToastMessage | null; onClose: () => void }) {
  if (!message) return null;
  const palette = message.type === 'success' ? 'bg-green-600' : message.type === 'error' ? 'bg-red-600' : 'bg-slate-800';
  return (
    <div className="fixed bottom-4 right-4 z-[60] max-w-sm rounded-xl px-4 py-3 text-sm font-bold text-white shadow-xl" role="status">
      <div className={`${palette} rounded-xl px-4 py-3`}>{message.text}</div>
      <button className="mt-2 text-xs text-slate-200 underline" onClick={onClose} type="button">Dismiss</button>
    </div>
  );
}
