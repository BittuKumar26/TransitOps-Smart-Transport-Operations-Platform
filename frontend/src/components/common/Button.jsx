export default function Button({ children, className = '', ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-xl bg-ink px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
