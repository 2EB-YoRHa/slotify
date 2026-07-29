import { usePage } from "@inertiajs/react";
import { Moon } from "lucide-react";

type SharedCurrentUser = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
};

type SharedPageProps = {
  current_user?: SharedCurrentUser | null;
};

export default function Header() {
  const { current_user } = usePage<SharedPageProps>().props;
  const role = current_user?.role;

  const headerContent =
    role === "member"
      ? {
          title: "Member Workspace",
          description: "Browse spaces, create bookings, and manage your reservations.",
        }
      : {
          title: "Workspace Operations",
          description: "Manage reservations, spaces, members, and organization settings.",
        };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="flex h-16 items-center justify-between px-8">
        <div>
          <h2 className="text-sm font-extrabold uppercase tracking-wide text-slate-400">
            {headerContent.title}
          </h2>

          <p className="text-sm text-slate-500">
            {headerContent.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
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

          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-50 text-sm font-extrabold text-cyan-500">
            {initials(current_user?.name)}
          </div>
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