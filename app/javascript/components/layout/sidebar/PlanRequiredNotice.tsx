import { LockKeyhole } from "lucide-react";

export default function PlanRequiredNotice() {
  return (
    <div className="mx-4 mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
      <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
        <LockKeyhole size={19} strokeWidth={2.4} />
      </div>

      <p className="text-sm font-extrabold text-slate-950">Plan required</p>

      <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
        Choose Starter or Pro to unlock dashboards, workspaces, reservations,
        and member management.
      </p>
    </div>
  );
}