export default function Input({ label, className = '', ...props }) {
  return (
    <label className="flex flex-col gap-2 text-sm font-medium text-slate">
      {label && <span>{label}</span>}
      <input className={`rounded-xl border border-slate-200 bg-white px-4 py-2 outline-none ring-0 focus:border-accent ${className}`} {...props} />
    </label>
  );
}
