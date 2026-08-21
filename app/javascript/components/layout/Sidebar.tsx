import { usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";
import type { SharedCurrentUser, SharedPageProps } from "../../types/layout";
import PlanRequiredNotice from "./sidebar/PlanRequiredNotice";
import SidebarBrand from "./sidebar/SidebarBrand";
import SidebarFooter from "./sidebar/SidebarFooter";
import SidebarNav from "./sidebar/SidebarNav";
import SignOutOverlay from "./sidebar/SignOutOverlay";
import {
  billingRequiredFor,
  logoHrefFor,
  navItemsFor,
} from "./sidebar/sidebarNavigation";
import useSidebarSignOut from "./sidebar/useSidebarSignOut";

type SidebarProps = {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
};

export default function Sidebar({
  mobileOpen = false,
  onCloseMobile,
}: SidebarProps) {
  const { url, props } = usePage<SharedPageProps>();
  const currentUser = props.current_user;
  const billingRequired = billingRequiredFor(currentUser);
  const logoHref = logoHrefFor(currentUser);
  const { signingOut, signOut } = useSidebarSignOut();

  function handleMobileSignOut() {
    onCloseMobile?.();
    signOut();
  }

  return (
    <>
      <aside className="hidden h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white transition-colors dark:border-slate-800 dark:bg-slate-950 lg:flex">
        <SidebarContent
          currentUser={currentUser}
          currentUrl={url}
          billingRequired={billingRequired}
          logoHref={logoHref}
          signingOut={signingOut}
          onSignOut={signOut}
        />
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-90 lg:hidden"
          >
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={onCloseMobile}
              className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            />

            <motion.aside
              initial={{ x: -320 }}
              animate={{ x: 0 }}
              exit={{ x: -320 }}
              transition={{ type: "spring", damping: 30, stiffness: 260 }}
              className="relative flex h-full w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-slate-200 bg-white shadow-2xl transition-colors dark:border-slate-800 dark:bg-slate-950"
            >
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={onCloseMobile}
                className="absolute right-4 top-4 z-10 inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <X size={17} strokeWidth={2.4} />
              </button>

              <SidebarContent
                currentUser={currentUser}
                currentUrl={url}
                billingRequired={billingRequired}
                logoHref={logoHref}
                signingOut={signingOut}
                onNavigate={onCloseMobile}
                onSignOut={handleMobileSignOut}
              />
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      <SignOutOverlay show={signingOut} />
    </>
  );
}

type SidebarContentProps = {
  currentUser?: SharedCurrentUser | null;
  currentUrl: string;
  billingRequired: boolean;
  logoHref: string;
  signingOut: boolean;
  onNavigate?: () => void;
  onSignOut: () => void;
};

function SidebarContent({
  currentUser,
  currentUrl,
  billingRequired,
  logoHref,
  signingOut,
  onNavigate,
  onSignOut,
}: SidebarContentProps) {
  const navItems = navItemsFor(currentUser);

  return (
    <>
      <SidebarBrand
        href={logoHref}
        billingRequired={billingRequired}
        onClick={onNavigate}
      />

      {billingRequired && <PlanRequiredNotice />}

      <SidebarNav
        items={navItems}
        currentUrl={currentUrl}
        billingRequired={billingRequired}
        onNavigate={onNavigate}
      />

      <SidebarFooter
        currentUser={currentUser}
        signingOut={signingOut}
        onSignOut={onSignOut}
      />
    </>
  );
}