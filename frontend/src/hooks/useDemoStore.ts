import { useEffect, useState } from 'react';
import { getDemoState, type DemoState } from '../services/mockStore';

export function useDemoStore() {
  const [state, setState] = useState<DemoState | null>(null);
  const [loading, setLoading] = useState(true);

  async function reload() {
    setLoading(true);
    const data = await getDemoState();
    setState(data);
    setLoading(false);
  }

  useEffect(() => {
    void reload();
  }, []);

  return { state, loading, reload };
}
