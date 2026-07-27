import { CheckCircle2, CreditCard, Sparkles } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SubscriptionPlanCardProps = {
  name: string;
  price: string;
  description: string;
  features: string[];
  icon: LucideIcon;
  current?: boolean;
  highlighted?: boolean;
};

export default function SubscriptionPlanCard({
  name,
  price,
  description,
  features,
  icon: Icon,
  current = false,
  highlighted = false,
}: SubscriptionPlanCardProps) {
  return (
    <div
      className={`relative rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md ${
        highlighted ? "border-cyan-200 ring-4 ring-cyan-50" : "border-slate-200"
      }`}
    >
      {highlighted && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-4 py-1 text-xs font-extrabold uppercase tracking-wide text-white shadow-sm">
          Recommended
        </div>
      )}

      <div className="mb-5 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <Icon size={24} strokeWidth={2.4} />
        </div>

        {current && (
          <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-600">
            Current
          </span>
        )}
      </div>

      <h3 className="text-xl font-bold text-slate-950">{name}</h3>

      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>

      <div className="mt-6 flex items-end gap-1">
        <span className="text-4xl font-extrabold text-slate-950">{price}</span>

        <span className="pb-1 text-sm font-medium text-slate-400">/month</span>
      </div>

      <div className="my-6 h-px bg-slate-100" />

      <div className="space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-cyan-500" />

            <span className="text-sm leading-6 text-slate-600">{feature}</span>
          </div>
        ))}
      </div>

      <div
        className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold ${
          current
            ? "bg-green-50 text-green-600"
            : "border border-slate-200 bg-slate-50 text-slate-500"
        }`}
      >
        {current ? (
          <>
            <Sparkles size={16} />
            Active Plan
          </>
        ) : (
          <>
            <CreditCard size={16} />
            Plan Option
          </>
        )}
      </div>
    </div>
  );
}
