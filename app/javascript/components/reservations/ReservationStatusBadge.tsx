type ReservationStatusBadgeProps = {
  status?: string | null;
};

export default function ReservationStatusBadge({
  status,
}: ReservationStatusBadgeProps) {
  const normalizedStatus = status || "pending";

  const classes: Record<string, string> = {
    confirmed: "bg-green-50 text-green-600",
    pending: "bg-yellow-50 text-yellow-600",
    cancelled: "bg-red-50 text-red-600",
    completed: "bg-slate-100 text-slate-500",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-bold ${
        classes[normalizedStatus] || "bg-slate-100 text-slate-500"
      }`}
    >
      {capitalize(normalizedStatus)}
    </span>
  );
}

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}