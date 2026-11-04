const styles = {
  Beschikbaar: "bg-available",
  Gereserveerd: "bg-reserved",
  Verkocht: "bg-sold",
} as const;

/** The car's status in plain words, with a small square in its colour. */
export function StatusBadge({ status, className = "" }: { status: keyof typeof styles; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 text-body font-medium ${className}`}>
      <span className={`size-2.5 ${styles[status]}`} aria-hidden="true" />
      {status}
    </span>
  );
}
