type ReservationStatusBadgeProps = {
  status?: string | null;
};

export default function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const normalizedStatus = status || "confirmed";

  const classes: Record<string, string> = {
    confirmed:
      "bg-green-50 text-green-600 dark:bg-green-500/15 dark:text-green-300",
    cancelled: "bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-300",
    concluded:
      "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300",
  };

  return (
    <span
      className={`inline-flex w-fit shrink-0 rounded-full px-3 py-1 text-xs font-bold ${
        classes[normalizedStatus] ||
        "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-300"
      }`}
    >
      {formatStatus(normalizedStatus)}
    </span>
  );
}

function formatStatus(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}