import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Field, Input } from '../components/FormControls';
import { APP_NAME, setAccessToken } from '../services/api';

export function LoginPage() {
  const [email, setEmail] = useState('manager@homex.local');
  const [password, setPassword] = useState('HomeX@2026!');
  const [error, setError] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  if (loggedIn) return <Navigate to="/" replace />;

  function handleDemoLogin() {
    if (!email || !password) {
      setError('Enter an email and password or use the demo account shortcut.');
      return;
    }
    setAccessToken('demo-home-x-token');
    setLoggedIn(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top_left,#f97316_0,#0f172a_35%,#020617_100%)] p-6">
      <section className="grid w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl lg:grid-cols-[1fr_0.85fr]">
        <div className="bg-slate-950 p-8 text-white md:p-12">
          <p className="text-xs font-black uppercase tracking-[0.35em] text-orange-400">Home-X Construction PLC</p>
          <h1 className="mt-6 text-4xl font-black tracking-tight">{APP_NAME}</h1>
          <p className="mt-4 text-lg leading-8 text-slate-300">Control materials, site stores, tools, equipment, fuel, damage/loss evidence and project phase costs with a ledger-first workflow.</p>
          <div className="mt-8 grid gap-3 text-sm text-slate-200"><span>✓ Storekeeper purchase receipts and transfers</span><span>✓ Manager approvals for material requests</span><span>✓ Tool responsibility and equipment fuel logs</span></div>
        </div>
        <div className="p-8 md:p-12">
          <h2 className="text-3xl font-black text-slate-950">Sign in</h2>
          <p className="mt-2 text-sm text-slate-600">Use the demo account while the backend is deployed separately.</p>
          {error ? <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p> : null}
          <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); handleDemoLogin(); }}>
            <Field label="Email"><Input value={email} onChange={(event) => setEmail(event.target.value)} type="email" /></Field>
            <Field label="Password"><Input value={password} onChange={(event) => setPassword(event.target.value)} type="password" /></Field>
            <Button className="w-full" type="submit">Sign in</Button>
            <Button className="w-full" type="button" variant="ghost" onClick={() => { setEmail('storekeeper@homex.local'); setPassword('HomeX@2026!'); setError(''); }}>Use storekeeper demo account</Button>
          </form>
        </div>
      </section>
    </main>
  );
}
