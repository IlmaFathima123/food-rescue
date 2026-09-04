const VARIANTS = {
  free: "bg-leaf-light text-leaf-deep",
  discounted: "bg-turmeric-light text-turmeric-deep",
  available: "bg-leaf-light text-leaf-deep",
  claimed: "bg-ink/10 text-ink-soft",
  urgent: "bg-clay-light text-clay-deep",
};

export default function Badge({ variant = "free", children }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 text-sm font-semibold ${VARIANTS[variant] || VARIANTS.free}`}
    >
      {children}
    </span>
  );
}
