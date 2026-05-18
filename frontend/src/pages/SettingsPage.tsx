import { Badge } from '../components/Badge';
import { Card } from '../components/Card';
import { Field, Input, Select } from '../components/FormControls';
import { PageHeader } from '../components/PageHeader';

const roles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'SITE_ENGINEER', 'STOREKEEPER', 'ACCOUNTANT', 'WORKER'];

export function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader eyebrow="System Settings" title="Company, stock rules and roles" description="Keep Home-X identity, stock policy and role permissions visible for deployment readiness." />
      <div className="grid gap-4 xl:grid-cols-2">
        <Card title="Company profile"><div className="grid gap-3"><Field label="Legal name"><Input defaultValue="Home-X Construction PLC" /></Field><Field label="Address"><Input placeholder="Addis Ababa, Ethiopia" /></Field><Field label="Contact"><Input placeholder="operations@homex.example" /></Field></div></Card>
        <Card title="Stock settings"><div className="grid gap-3"><Field label="Allow negative stock"><Select defaultValue="false"><option value="false">false</option><option value="true">true</option></Select></Field><Field label="Default currency"><Input defaultValue="ETB" /></Field><Field label="Low stock rule"><Input defaultValue="Alert when current stock is below item threshold" /></Field></div></Card>
      </div>
      <Card title="Role settings display"><div className="flex flex-wrap gap-2">{roles.map((role) => <Badge key={role} tone="blue">{role}</Badge>)}</div></Card>
    </div>
  );
}
