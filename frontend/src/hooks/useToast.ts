import { useState } from 'react';
import type { ToastMessage } from '../components/ui/Toast';

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  return {
    toast,
    showSuccess: (text: string) => setToast({ type: 'success', text }),
    showError: (text: string) => setToast({ type: 'error', text }),
    showInfo: (text: string) => setToast({ type: 'info', text }),
    clear: () => setToast(null),
  };
}
