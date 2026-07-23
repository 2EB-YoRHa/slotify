import { Link, router, usePage } from "@inertiajs/react";

type NavItem = {
  label: string;
  href: string;
  icon: string;
  exact?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: "▦", exact: true },
  { label: "Reservations", href: "/reservations", icon: "▣" },
  { label: "Workspaces", href: "/workspaces", icon: "▤" },
  { label: "Amenities", href: "/amenities", icon: "✦" },
  { label: "My Bookings", href: "/my_reservations", icon: "◎" },
  { label: "Organization", href: "/organization", icon: "♙" },
  { label: "Subscription", href: "/subscription", icon: "$" },
  { label: "Settings", href: "/booking_rule", icon: "⚙" },
];

export default function Sidebar() {
  const { url } = usePage();

  function isActive(item: NavItem): boolean {
    if (item.exact) return url === item.href;

    return url.startsWith(item.href);
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-white">
          ◇
        </div>

        <span className="text-xl font-bold text-cyan-500">Slotify</span>
      </div>

      <nav className="mt-6 px-3">
        {navItems.map((item) => {
          const active = isActive(item);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`mb-1 flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium ${
                active
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 w-full border-t border-slate-200 p-4">
        <button
          type="button"
          onClick={() => router.delete("/users/sign_out")}
          className="text-sm font-medium text-red-500 hover:text-red-600"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}
