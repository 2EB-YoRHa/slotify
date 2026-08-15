import { Link } from "@inertiajs/react";
import type { NavItem } from "../../../types/layout";
import { isActive } from "./sidebarNavigation";

type SidebarNavProps = {
  items: NavItem[];
  currentUrl: string;
  billingRequired: boolean;
};

export default function SidebarNav({
  items,
  currentUrl,
  billingRequired,
}: SidebarNavProps) {
  return (
    <nav className="min-h-0 flex-1 space-y-2 overflow-y-auto px-4 py-6">
      {items.map((item) => {
        const active = isActive(currentUrl, item.href);
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
                  active ? "bg-white/20 text-white" : "bg-amber-50 text-amber-600"
                }`}
              >
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}