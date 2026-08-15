import { router } from "@inertiajs/react";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { SharedCurrentUser } from "../../../types/layout";
import ProfileDropdown from "./ProfileDropdown";
import UserAvatar from "./UserAvatar";

type HeaderProfileMenuProps = {
  user?: SharedCurrentUser | null;
  billingRequired: boolean;
};

export default function HeaderProfileMenu({
  user,
  billingRequired,
}: HeaderProfileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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
        <UserAvatar user={user} billingRequired={billingRequired} />

        <ChevronDown
          size={15}
          className={`text-slate-400 transition ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {menuOpen && (
        <ProfileDropdown
          user={user}
          billingRequired={billingRequired}
          onClose={() => setMenuOpen(false)}
          onSignOut={signOut}
        />
      )}
    </div>
  );
}