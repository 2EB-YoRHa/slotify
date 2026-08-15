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
      className="absolute right-0 top-14 z-50 w-[calc(100vw-2rem)] max-w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
    >
      <div
        className={`border-b p-5 ${
          billingRequired
            ? "border-amber-100 bg-amber-50"
            : "border-cyan-100 bg-cyan-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <UserAvatar user={user} billingRequired={billingRequired} />

          <div className="min-w-0">
            <p className="truncate text-sm font-extrabold text-slate-950">
              {user?.name || "User"}
            </p>

            <p className="mt-1 truncate text-xs font-semibold text-slate-500">
              {user?.email || "No email"}
            </p>

            <p
              className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wide ${
                billingRequired
                  ? "bg-white text-amber-600"
                  : "bg-white text-cyan-600"
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

      <div className="border-t border-slate-200 p-2">
        <button
          type="button"
          onClick={onSignOut}
          className="flex w-full items-start gap-3 rounded-xl px-4 py-3 text-left transition hover:bg-red-50"
        >
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-500">
            <LogOut size={17} />
          </div>

          <div>
            <p className="text-sm font-extrabold text-red-500">
              Sign out of account
            </p>

            <p className="mt-1 text-xs leading-5 text-red-400">
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
      className="flex items-start gap-3 rounded-xl px-4 py-3 transition hover:bg-slate-50"
    >
      <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-slate-500">
        <Icon size={17} />
      </div>

      <div>
        <p className="text-sm font-extrabold text-slate-950">{title}</p>

        <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
      </div>
    </Link>
  );
}