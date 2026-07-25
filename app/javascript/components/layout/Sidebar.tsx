import { Link, router, usePage } from "@inertiajs/react";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings2,
  Sparkles,
  UsersRound,
} from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: typeof LayoutDashboard;
};

const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    label: "Reservations",
    href: "/reservations",
    icon: CalendarCheck,
  },
  {
    label: "Workspaces",
    href: "/workspaces",
    icon: Building2,
  },
  {
    label: "Amenities",
    href: "/amenities",
    icon: Sparkles,
  },
  {
    label: "My Bookings",
    href: "/my_reservations",
    icon: CalendarDays,
  },
  {
    label: "Organization",
    href: "/organization",
    icon: UsersRound,
  },
  {
    label: "Subscription",
    href: "/subscription",
    icon: CreditCard,
  },
  {
    label: "Booking Rules",
    href: "/booking_rule",
    icon: Settings2,
  },
];

export default function Sidebar() {
  const { url } = usePage();

  function isActive(href: string) {
    if (href === "/") return url === "/";

    return url.startsWith(href);
  }

  function signOut() {
    router.delete("/users/sign_out");
  }

  return (
    <aside className="flex min-h-screen w-64 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-white shadow-sm shadow-cyan-200">
          <Sparkles size={20} strokeWidth={2.5} />
        </div>

        <div>
          <p className="text-xl font-extrabold leading-none text-cyan-400">
            Slotify
          </p>

          <p className="mt-1 text-xs font-semibold text-slate-400">
            Workspace SaaS
          </p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-6">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
              }`}
            >
              <Icon
                size={18}
                strokeWidth={2.4}
                className={
                  active
                    ? "text-white"
                    : "text-slate-400 group-hover:text-cyan-500"
                }
              />

              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 p-4">
        <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Current Plan
          </p>

          <p className="mt-2 text-sm font-extrabold text-slate-900">
            Pro Workspace
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full w-2/3 rounded-full bg-cyan-400" />
          </div>

          <p className="mt-2 text-xs text-slate-400">
            Demo environment
          </p>
        </div>

        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} strokeWidth={2.4} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}