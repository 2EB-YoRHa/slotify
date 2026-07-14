type SubscriptionPlanCardProps = {
  title: string;
  description: string;
  active: boolean;
};

export default function SubscriptionPlanCard({
  title,
  description,
  active,
}: SubscriptionPlanCardProps) {
  return (
    <div
      className={`rounded-xl border p-5 shadow-sm ${
        active ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>

        {active && (
          <span className="rounded-full bg-cyan-400 px-3 py-1 text-xs font-bold text-white">
            Active
          </span>
        )}
      </div>

      <p className="mt-3 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}