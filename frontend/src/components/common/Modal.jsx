export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-slate-950/50 p-4" onClick={onClose}>
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
        {title && <h2 className="mb-4 text-xl font-semibold text-ink">{title}</h2>}
        {children}
      </div>
    </div>
  );
}
