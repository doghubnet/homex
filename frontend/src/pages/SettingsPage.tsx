import { useState } from 'react';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';
import { Toast, type ToastMessage } from '../components/Toast';
import { API_BASE_URL, APP_NAME, MOCKS_ENABLED } from '../services/api';
import { getRuntimeModeLabel, resetDemoState } from '../services/mockStore';

const roles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SITE_ENGINEER', 'STOREKEEPER', 'ACCOUNTANT', 'WORKER'];

export function SettingsPage() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  async function onResetDemoData() {
    await resetDemoState();
    setConfirmReset(false);
    setToast({ type: 'success', text: 'Demo data has been reset. Refresh pages to load clean sample data.' });
  }

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="System Settings" title="Company, stock rules and roles" description="Keep Home-X identity, stock policy, permissions and deployment configuration visible." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Company profile"><div className="grid gap-3"><Field label="Application name"><Input defaultValue={APP_NAME} /></Field><Field label="Legal name"><Input defaultValue="Home-X Construction PLC" /></Field><Field label="Address"><Input placeholder="Addis Ababa, Ethiopia" /></Field><Field label="Contact"><Input placeholder="operations@homex.example" /></Field><Button type="button">Save company profile</Button></div></Card>
        <Card title="Stock settings"><div className="grid gap-3"><Field label="Allow negative stock"><Select defaultValue="false"><option value="false">false</option><option value="true">true</option></Select></Field><Field label="Require manager approval for adjustments"><Select defaultValue="true"><option value="true">true</option><option value="false">false</option></Select></Field><Field label="Require evidence for damage/loss"><Select defaultValue="true"><option value="true">true</option><option value="false">false</option></Select></Field><Field label="Default currency"><Input defaultValue="ETB" /></Field><Field label="Low stock rule"><Input defaultValue="Alert when current stock is below item threshold" /></Field><Button type="button">Save stock policies</Button></div></Card>
      </div>
      <Card title="Role permission matrix display"><div className="flex flex-wrap gap-2">{roles.map((role) => <Badge key={role} tone="blue">{role}</Badge>)}</div></Card>
      <Card title="Deployment and runtime information"><div className="grid gap-3 text-sm"><p><span className="font-bold">Vercel frontend root:</span> frontend</p><p><span className="font-bold">API URL:</span> {API_BASE_URL}</p><p><span className="font-bold">Mock mode:</span> {String(MOCKS_ENABLED)} ({getRuntimeModeLabel()})</p><p><span className="font-bold">Backend status:</span> separate deployment target (Docker/VPS/Node host)</p></div></Card>
      <Card title="Demo mode controls">
        <div className="flex flex-wrap gap-3">
          <Button type="button" variant="danger" onClick={() => setConfirmReset(true)}>Reset demo data</Button>
          <Button type="button" variant="ghost" onClick={() => { localStorage.removeItem('homex_access_token'); setToast({ type: 'info', text: 'Local auth token cleared.' }); }}>Clear local auth token</Button>
        </div>
        {confirmReset ? <div className="mt-4 rounded-xl bg-red-50 p-4"><p className="text-sm font-bold text-red-700">Confirm reset demo data?</p><div className="mt-2 flex gap-2"><Button type="button" variant="danger" onClick={onResetDemoData}>Yes, reset</Button><Button type="button" variant="ghost" onClick={() => setConfirmReset(false)}>Cancel</Button></div></div> : null}
      </Card>
      <Toast message={toast} onClose={() => setToast(null)} />
    </div>
  );
}
