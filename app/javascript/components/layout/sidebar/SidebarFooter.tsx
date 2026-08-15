import { LogOut } from "lucide-react";
import type { SharedCurrentUser } from "../../../types/layout";

type SidebarFooterProps = {
  currentUser?: SharedCurrentUser | null;
  signingOut: boolean;
  onSignOut: () => void;
};

export default function SidebarFooter({
  currentUser,
  signingOut,
  onSignOut,
}: SidebarFooterProps) {
  return (
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
        onClick={onSignOut}
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
  );
}