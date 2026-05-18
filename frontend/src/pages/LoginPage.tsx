export function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6">
      <section className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-orange-500">Home-X</p>
        <h1 className="mt-3 text-3xl font-bold text-slate-950">Sign in</h1>
        <p className="mt-2 text-sm text-slate-600">JWT authentication is planned for Phase 2. This page is the frontend foundation shell.</p>
        <form className="mt-6 space-y-4">
          <input className="w-full rounded-xl border border-stone-300 px-4 py-3" placeholder="Email" type="email" />
          <input className="w-full rounded-xl border border-stone-300 px-4 py-3" placeholder="Password" type="password" />
          <button className="w-full rounded-xl bg-orange-500 px-4 py-3 font-bold text-white hover:bg-orange-600" type="button">
            Continue
          </button>
        </form>
      </section>
    </main>
  );
}
