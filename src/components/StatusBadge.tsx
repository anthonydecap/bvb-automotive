const styles = {
  Beschikbaar: "bg-available",
  Gereserveerd: "bg-reserved",
  Verkocht: "bg-sold",
} as const;

export function StatusBadge({ status, className = "" }: { status: keyof typeof styles; className?: string }) {
  return (
    <span
      className={`spec-label inline-flex items-center gap-2 rounded-sm bg-ink/85 px-2.5 py-1.5 text-white backdrop-blur ${className}`}
    >
      <span className={`size-1.5 rounded-full ${styles[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}
