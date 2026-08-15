import { usePage } from "@inertiajs/react";
import type { SharedPageProps } from "../../types/layout";
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

export default function Sidebar() {
  const { url, props } = usePage<SharedPageProps>();
  const currentUser = props.current_user;
  const billingRequired = billingRequiredFor(currentUser);
  const navItems = navItemsFor(currentUser);
  const logoHref = logoHrefFor(currentUser);
  const { signingOut, signOut } = useSidebarSignOut();

  return (
    <>
      <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-slate-200 bg-white">
        <SidebarBrand href={logoHref} billingRequired={billingRequired} />

        {billingRequired && <PlanRequiredNotice />}

        <SidebarNav
          items={navItems}
          currentUrl={url}
          billingRequired={billingRequired}
        />

        <SidebarFooter
          currentUser={currentUser}
          signingOut={signingOut}
          onSignOut={signOut}
        />
      </aside>

      <SignOutOverlay show={signingOut} />
    </>
  );
}