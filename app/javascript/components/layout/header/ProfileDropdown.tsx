import { Link } from "@inertiajs/react";
import { Building2, LogOut, ShieldCheck, UserRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { SharedCurrentUser } from "../../../types/layout";
import { formatText } from "../../../utils/layoutText";
import UserAvatar from "./UserAvatar";

type ProfileDropdownProps = {
  user?: SharedCurrentUser | null;
  billingRequired: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

export default function ProfileDropdown({
  user,
  billingRequired,
  onClose,
  onSignOut,
}: ProfileDropdownProps) {
  const isMember = user?.role === "member";

  return (
    <div
      role="menu"
      className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl shadow-slate-950/10 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:shadow-slate-950/40"
    >
      <div
        className={`border-b p-5 transition-colors ${
          billingRequired
            ? "border-amber-100 bg-amber-50 dark:border-amber-500/20 dark:bg-amber-500/10"
            : "border-cyan-100 bg-cyan-50 dark:border-cyan-500/20 dark:bg-cyan-500/10"
        }`}
      >
        <div className="flex min-w-0 items-center gap-4">
          <UserAvatar user={user} billingRequired={billingRequired} />

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-950 dark:text-slate-100">
              {user?.name || "User"}
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-500 dark:text-slate-400">
              {user?.email || "No email"}
            </p>

            <p
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                billingRequired
                  ? "bg-white text-amber-600 dark:bg-amber-500/15 dark:text-amber-300"
                  : "bg-white text-cyan-600 dark:bg-cyan-500/15 dark:text-cyan-300"
              }`}
            >
              {formatText(user?.role)}
            </p>
          </div>
        </div>
      </div>

      <div className="p-2">
        <DropdownLink
          href="/profile"
          icon={UserRound}
          title="View my profile"
          description="Photo, name and email"
          onClick={onClose}
        />

        <DropdownLink
          href="/security"
          icon={ShieldCheck}
          title="Security"
          description="Password and two-factor authentication"
          onClick={onClose}
        />

        {!isMember && (
          <DropdownLink
            href="/organization"
            icon={Building2}
            title="Organization"
            description={user?.organization_name || "View organization details"}
            onClick={onClose}
          />
        )}
      </div>

      <div className="border-t border-slate-200 p-2 dark:border-slate-800">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full min-w-0 items-start gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-red-50 dark:hover:bg-red-500/10"
        >
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500 dark:bg-red-500/10 dark:text-red-300">
            <LogOut size={17} />
          </div>

          <div className="min-w-0">
            <p className="wrap-break-word text-sm font-extrabold text-red-500 dark:text-red-300">
              Sign out of account
            </p>

            <p className="mt-1 text-xs leading-5 text-red-400 dark:text-red-300/80">
              End your current session
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

type DropdownLinkProps = {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
  onClick: () => void;
};

function DropdownLink({
  href,
  icon: Icon,
  title,
  description,
  onClick,
}: DropdownLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="flex min-w-0 items-start gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-50 dark:hover:bg-slate-800"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="wrap-break-word text-sm font-extrabold text-slate-950 dark:text-slate-100">
          {title}
        </p>

        <p className="mt-1 wrap-break-word text-xs leading-5 text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
    </Link>
  );
}