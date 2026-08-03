type ReservationStatusBadgeProps = {
  status?: string | null;
};

export default function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const normalizedStatus = status || "confirmed";

  const classes: Record<string, string> = {
    confirmed: "bg-green-50 text-green-600",
    cancelled: "bg-red-50 text-red-600",
    concluded: "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        classes[normalizedStatus] || "bg-slate-100 text-slate-500"
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