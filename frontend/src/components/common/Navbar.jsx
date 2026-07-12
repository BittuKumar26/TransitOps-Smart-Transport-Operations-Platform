export default function Navbar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
      <div>
        <p className="text-xs uppercase tracking-[0.35em] text-teal-600">TransitOps</p>
        <h1 className="text-xl font-semibold text-ink">Smart Transport Operations Platform</h1>
      </div>
      <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-500 to-cyan-400" />
    </header>
  );
}
