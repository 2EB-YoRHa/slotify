import { usePage } from "@inertiajs/react";
import type { ReactNode } from "react";
import type { SharedPageProps } from "../../types/layout";
import { headerMetaFor } from "../../utils/headerMeta";
import DarkModeToggle from "./header/DarkModeToggle";
import HeaderProfileMenu from "./header/HeaderProfileMenu";

type HeaderProps = {
  actions?: ReactNode;
};

export default function Header({ actions = null }: HeaderProps) {
  const { url, props } = usePage<SharedPageProps>();
  const currentUser = props.current_user;
  const headerMeta = headerMetaFor(url, currentUser?.role);
  const billingRequired = Boolean(currentUser?.billing_required);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-6 px-8 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-black text-slate-950">
            {headerMeta.title}
          </p>

          <p className="mt-1 max-w-2xl truncate text-xs font-semibold text-slate-500">
            {headerMeta.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          {actions && (
            <div className="hidden items-center gap-2 xl:flex">
              {actions}
            </div>
          )}

          {actions && <div className="hidden h-8 w-px bg-slate-200 xl:block" />}

          <DarkModeToggle />

          <HeaderProfileMenu
            user={currentUser}
            billingRequired={billingRequired}
          />
        </div>
      </div>

      {actions && (
        <div className="border-t border-slate-100 px-8 py-3 xl:hidden">
          <div className="flex flex-wrap justify-end gap-3">{actions}</div>
        </div>
      )}
    </header>
  );
}