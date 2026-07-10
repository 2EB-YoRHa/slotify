import { Link, usePage } from "@inertiajs/react";

export default function AppLayout({ children }) {
  const { url } = usePage();

  const navItems = [
    { label: "Dashboard", href: "/", icon: "▦" },
    { label: "Reservations", href: "/reservations", icon: "▣" },
    { label: "Workspaces", href: "/workspaces", icon: "▤" },
    { label: "My Bookings", href: "/reservations", icon: "◎" },
    { label: "Organization", href: "/organization", icon: "♙" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-200 bg-white">
        <div className="flex h-16 items-center gap-3 border-b border-slate-200 px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-400 text-white">
            ◇
          </div>
          <span className="text-xl font-bold text-cyan-500">Slotify</span>
        </div>

        <nav className="mt-6 px-3">
          {navItems.map((item) => {
            const active = url === item.href;

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
          <Link
            href="/users/sign_out"
            method="delete"
            as="button"
            className="text-sm font-medium text-red-500"
          >
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="ml-64">
        <header className="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
          <div className="flex items-center gap-4">
            <select className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
              <option>Design Studio</option>
            </select>

            <input
              type="text"
              placeholder="Search reservations, users..."
              className="w-96 rounded-lg border border-slate-100 bg-slate-50 px-4 py-2 text-sm outline-none"
            />
          </div>

          <div className="flex items-center gap-4">
            <span className="text-lg">⌁</span>
            <div className="h-9 w-9 rounded-full bg-slate-200" />
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}