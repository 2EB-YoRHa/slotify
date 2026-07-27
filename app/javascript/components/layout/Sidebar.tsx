import { Link, router, usePage } from "@inertiajs/react";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  CreditCard,
  LayoutDashboard,
  LogOut,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
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
    icon: SlidersHorizontal,
  },
];

export default function Sidebar() {
  const { url } = usePage();

  function signOut() {
    router.delete("/users/sign_out");
  }

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center px-7">
        <Link href="/" className="group inline-block">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black tracking-[-0.045em] text-slate-950">
              Slotify
            </span>

            <span className="h-2 w-2 rounded-full bg-cyan-400 transition group-hover:scale-125" />
          </div>

          <div className="mt-1.5 h-px w-14 bg-linear-to-r from-cyan-400 to-transparent" />
        </Link>
      </div>

      <nav className="flex-1 space-y-2 px-4 py-6">
        {navItems.map((item) => {
          const active = isActive(url, item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                active
                  ? "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} strokeWidth={2.2} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-200 px-4 py-6">
        <button
          type="button"
          onClick={signOut}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50"
        >
          <LogOut size={18} strokeWidth={2.2} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}

function isActive(currentUrl: string, href: string): boolean {
  if (href === "/") return currentUrl === "/";

  return currentUrl.startsWith(href);
}
