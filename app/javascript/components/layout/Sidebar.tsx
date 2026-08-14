import { Link, router, usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  LayoutDashboard,
  LockKeyhole,
  LogOut,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SharedCurrentUser = {
  id: number;
  name: string;
  email: string;
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

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};

const managerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Reservations", href: "/reservations", icon: CalendarCheck },
  { label: "Workspaces", href: "/workspaces", icon: Building2 },
  { label: "Amenities", href: "/amenities", icon: Sparkles },
  { label: "My Bookings", href: "/my_reservations", icon: CalendarDays },
  { label: "Organization", href: "/organization", icon: UsersRound },
  { label: "Subscription", href: "/subscription", icon: CreditCard },
  { label: "Booking Rules", href: "/booking_rule", icon: SlidersHorizontal },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const proManagerNavItems: NavItem[] = [
  ...managerNavItems.slice(0, 8),
  { label: "Time Slots", href: "/booking_time_slots", icon: Clock3 },
  ...managerNavItems.slice(8),
];

const memberNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Browse Workspaces", href: "/workspaces", icon: Building2 },
  { label: "My Bookings", href: "/my_reservations", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const billingRequiredNavItems: NavItem[] = [
  {
    label: "Subscription",
    href: "/subscription",
    icon: CreditCard,
    badge: "Required",
  },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export default function Sidebar() {
  const { url, props } = usePage<SharedPageProps>();
  const [signingOut, setSigningOut] = useState(false);

  const currentUser = props.current_user;
  const role = currentUser?.role;
  const isMember = role === "member";
  const isManagerOrAdmin = role === "manager" || role === "admin";
  const billingRequired = Boolean(
    currentUser?.billing_required && isManagerOrAdmin,
  );

  const managerItems =
    currentUser?.current_plan === "pro" ? proManagerNavItems : managerNavItems;

  const navItems = billingRequired
    ? billingRequiredNavItems
    : isMember
      ? memberNavItems
      : managerItems;

  const logoHref = billingRequired ? "/subscription" : "/";

  function signOut() {
    setSigningOut(true);

    router.delete("/users/sign_out", {
      onFinish: () => setSigningOut(false),
    });
  }

  return (
    <>
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center px-7">
          <Link href={logoHref} className="group inline-block">
            <span className="block text-2xl font-black tracking-[-0.055em] text-slate-950 transition group-hover:text-slate-800">
              Slotify
            </span>

            <span className="mt-1.5 flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full transition group-hover:scale-125 ${
                  billingRequired ? "bg-amber-400" : "bg-cyan-400"
                }`}
              />

              <span
                className={`h-px w-14 bg-linear-to-r to-transparent ${
                  billingRequired ? "from-amber-400" : "from-cyan-400"
                }`}
              />
            </span>
          </Link>
        </div>

        {billingRequired && (
          <div className="mx-4 mt-4 rounded-2xl border border-amber-100 bg-amber-50 p-4">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white text-amber-500 shadow-sm">
              <LockKeyhole size={19} strokeWidth={2.4} />
            </div>

            <p className="text-sm font-extrabold text-slate-950">
              Plan required
            </p>

            <p className="mt-2 text-xs font-semibold leading-5 text-slate-600">
              Choose Starter or Pro to unlock dashboards, workspaces,
              reservations, and member management.
            </p>
          </div>
        )}

        <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-6">
          {navItems.map((item) => {
            const active = isActive(url, item.href);
            const Icon = item.icon;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between gap-3 rounded-xl px-4 py-3 text-sm font-bold transition ${
                  active
                    ? billingRequired
                      ? "bg-amber-400 text-white shadow-sm shadow-amber-100"
                      : "bg-cyan-400 text-white shadow-sm shadow-cyan-100"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={18} strokeWidth={2.2} />
                  {item.label}
                </span>

                {item.badge && (
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-amber-50 text-amber-600"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-slate-200 px-4 py-6">
          {currentUser?.organization_name && (
            <div className="mb-4 rounded-xl bg-slate-50 px-4 py-3">
              <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
                Organization
              </p>

              <p className="mt-1 truncate text-sm font-bold text-slate-700">
                {currentUser.organization_name}
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={signOut}
            disabled={signingOut}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {signingOut ? (
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              <LogOut size={18} strokeWidth={2.2} />
            )}

            {signingOut ? "Signing out..." : "Sign Out"}
          </button>
        </div>
      </aside>

      <AnimatePresence>
        {signingOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-120 flex items-center justify-center bg-slate-950/30 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 18, scale: 0.96 }}
              className="rounded-2xl border border-slate-200 bg-white px-8 py-7 text-center shadow-xl"
            >
              <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-4 border-cyan-100 border-t-cyan-400" />

              <h2 className="text-lg font-extrabold text-slate-950">
                Signing out
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Closing your session securely...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function isActive(currentUrl: string, href: string): boolean {
  if (href === "/") return currentUrl === "/";

  return currentUrl.startsWith(href);
}
