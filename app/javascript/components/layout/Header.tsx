import { Link, router, usePage } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import {
  Building2,
  ChevronDown,
  LogOut,
  Moon,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

type SharedCurrentUser = {
  id?: number;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  organization_name?: string | null;
  billing_required?: boolean;
};

type SharedPageProps = {
  current_user?: SharedCurrentUser | null;
};

export default function Header() {
  const { current_user } = usePage<SharedPageProps>().props;
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const billingRequired = Boolean(current_user?.billing_required);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!menuRef.current) return;

      if (!menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  function signOut() {
    setMenuOpen(false);
    router.delete("/users/sign_out");
  }

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 px-8 py-3 backdrop-blur">
      <div className="flex items-center justify-between gap-6">
        <div>
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            {current_user?.role === "member"
              ? "Member Workspace"
              : "Workspace Management"}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {current_user?.role === "member"
              ? "Browse spaces, create bookings, and manage your reservations."
              : "Manage spaces, bookings, members, and billing."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <button
            type="button"
            className="inline-flex items-center gap-3 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-500 shadow-sm transition hover:bg-slate-50"
          >
            <Moon size={16} />
            Dark Mode
            <span className="relative h-5 w-9 rounded-full bg-slate-200">
              <span className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white shadow-sm" />
            </span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className={`flex items-center gap-2 rounded-full p-1 pr-2 text-sm font-extrabold transition hover:bg-slate-100 ${
                menuOpen ? "bg-slate-100" : ""
              }`}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
            >
              <Avatar user={current_user} billingRequired={billingRequired} />

              <ChevronDown
                size={15}
                className={`text-slate-400 transition ${
                  menuOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {menuOpen && (
              <ProfileDropdown
                user={current_user}
                billingRequired={billingRequired}
                onClose={() => setMenuOpen(false)}
                onSignOut={signOut}
              />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

function Avatar({
  user,
  billingRequired,
}: {
  user?: SharedCurrentUser | null;
  billingRequired: boolean;
}) {
  return (
    <div
      className={`flex h-10 w-10 items-center justify-center overflow-hidden rounded-full text-sm font-extrabold ring-2 ring-transparent transition ${
        billingRequired
          ? "bg-amber-50 text-amber-500"
          : "bg-cyan-50 text-cyan-500"
      }`}
    >
      {user?.avatar_url ? (
        <img
          src={user.avatar_url}
          alt={user?.name || "Profile"}
          className="h-full w-full object-cover"
        />
      ) : (
        initials(user?.name)
      )}
    </div>
  );
}

type ProfileDropdownProps = {
  user?: SharedCurrentUser | null;
  billingRequired: boolean;
  onClose: () => void;
  onSignOut: () => void;
};

function ProfileDropdown({
  user,
  billingRequired,
  onClose,
  onSignOut,
}: ProfileDropdownProps) {
  const isMember = user?.role === "member";

  return (
    <div
      role="menu"
      className="absolute right-0 top-14 z-50 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl"
    >
      <div
        className={`border-b p-5 ${
          billingRequired
            ? "border-amber-100 bg-amber-50"
            : "border-cyan-100 bg-cyan-50"
        }`}
      >
        <div className="flex items-center gap-4">
          <Avatar user={user} billingRequired={billingRequired} />

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

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatText(value?: string | null): string {
  if (!value) return "User";

  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
}
