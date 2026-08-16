import { usePage } from "@inertiajs/react";
import { Menu } from "lucide-react";
import type { ReactNode } from "react";
import type { SharedPageProps } from "../../types/layout";
import { headerMetaFor } from "../../utils/headerMeta";
import DarkModeToggle from "./header/DarkModeToggle";
import HeaderProfileMenu from "./header/HeaderProfileMenu";

type HeaderProps = {
  actions?: ReactNode;
  onOpenSidebar: () => void;
};

export default function Header({ actions = null, onOpenSidebar }: HeaderProps) {
  const { url, props } = usePage<SharedPageProps>();
  const currentUser = props.current_user;
  const headerMeta = headerMetaFor(url, currentUser?.role);
  const billingRequired = Boolean(currentUser?.billing_required);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur transition-colors dark:border-slate-800 dark:bg-slate-950/90">
      <div className="flex min-h-16 items-center justify-between gap-2 px-3 py-2 sm:gap-3 sm:px-6 lg:gap-6 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onOpenSidebar}
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Open navigation menu"
          >
            <Menu size={19} strokeWidth={2.4} />
          </button>

          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-black leading-5 text-slate-950 dark:text-slate-100 sm:text-sm">
              {headerMeta.title}
            </p>

            <p className="mt-1 hidden max-w-2xl truncate text-xs font-semibold text-slate-500 dark:text-slate-400 sm:block">
              {headerMeta.description}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {actions && (
            <div className="hidden items-center gap-2 xl:flex">
              {actions}
            </div>
          )}

          {actions && (
            <div className="hidden h-8 w-px bg-slate-200 dark:bg-slate-800 xl:block" />
          )}

          <DarkModeToggle />

          <HeaderProfileMenu
            user={currentUser}
            billingRequired={billingRequired}
          />
        </div>
      </div>

      {actions && (
        <div className="border-t border-slate-100 px-3 py-3 dark:border-slate-800 sm:px-6 lg:px-8 xl:hidden">
          <div className="flex flex-wrap justify-end gap-3">{actions}</div>
        </div>
      )}
    </header>
  );
}