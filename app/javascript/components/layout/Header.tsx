import { Link, usePage } from "@inertiajs/react";
import { LockKeyhole, Moon } from "lucide-react";

type SharedCurrentUser = {
  id: number;
  name: string;
  email: string;
  avatar_url?: string | null;
  role?: string | null;
  organization_id?: number | null;
  organization_name?: string | null;
  current_plan?: string | null;
  billing_required?: boolean;
  subscription_active?: boolean;
};

type SharedPageProps = {
  current_user?: SharedCurrentUser | null;
};

export default function Header() {
  const { current_user } = usePage<SharedPageProps>().props;
  const role = current_user?.role;
  const isMember = role === "member";
  const isManagerOrAdmin = role === "manager" || role === "admin";
  const billingRequired = Boolean(
    current_user?.billing_required && isManagerOrAdmin,
  );

  const headerContent = billingRequired
    ? {
        title: "Billing Required",
        description:
          "Choose Starter or Pro to unlock your organization workspace.",
      }
    : isMember
      ? {
          title: "Member Workspace",
          description:
            "Browse spaces, create bookings, and manage your reservations.",
        }
      : {
          title: "Workspace Operations",
          description:
            "Manage reservations, spaces, members, and organization settings.",
        };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-8">
        <div className="flex items-center gap-4">
          {billingRequired && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-500">
              <LockKeyhole size={19} strokeWidth={2.4} />
            </div>
          )}

          <div>
            <h2
              className={`text-sm font-extrabold uppercase tracking-wide ${
                billingRequired ? "text-amber-500" : "text-slate-400"
              }`}
            >
              {headerContent.title}
            </h2>

            <p className="text-sm text-slate-500">
              {headerContent.description}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {billingRequired && (
            <span className="rounded-full bg-amber-50 px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-amber-600">
              Plan Required
            </span>
          )}

          <button
            type="button"
            disabled
            title="Dark mode coming soon"
            className="inline-flex cursor-not-allowed items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-bold text-slate-500 opacity-90"
          >
            <Moon size={16} className="text-slate-400" />

            <span>Dark Mode</span>

            <span className="relative inline-flex h-5 w-9 rounded-full bg-slate-200">
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
            </span>
          </button>

          <Link
            href="/profile"
            title="My Profile"
            className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ring-2 ring-transparent transition hover:ring-cyan-100 ${
              billingRequired
                ? "bg-amber-50 text-amber-500"
                : "bg-cyan-50 text-cyan-500"
            }`}
          >
            {current_user?.avatar_url ? (
              <img
                src={current_user.avatar_url}
                alt={current_user?.name || "Profile"}
                className="h-full w-full object-cover"
              />
            ) : (
              initials(current_user?.name)
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
