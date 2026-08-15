import {
  Building2,
  CalendarCheck,
  CalendarDays,
  Clock3,
  CreditCard,
  LayoutDashboard,
  SlidersHorizontal,
  Sparkles,
  UsersRound,
  UserRound,
} from "lucide-react";
import type { NavItem, SharedCurrentUser } from "../../../types/layout";

const managerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Reservations", href: "/reservations", icon: CalendarCheck },
  { label: "Workspaces", href: "/workspaces", icon: Building2 },
  { label: "Amenities", href: "/amenities", icon: Sparkles },
  { label: "My Bookings", href: "/my_reservations", icon: CalendarDays },
  { label: "Organization", href: "/organization", icon: UsersRound },
  { label: "Subscription", href: "/subscription", icon: CreditCard },
  { label: "Booking Rules", href: "/booking_rule", icon: SlidersHorizontal },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const proManagerNavItems: NavItem[] = [
  ...managerNavItems.slice(0, 8),
  { label: "Time Slots", href: "/booking_time_slots", icon: Clock3 },
  ...managerNavItems.slice(8),
];

const memberNavItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Browse Workspaces", href: "/workspaces", icon: Building2 },
  { label: "My Bookings", href: "/my_reservations", icon: CalendarDays },
  { label: "Profile", href: "/profile", icon: UserRound },
];

const billingRequiredNavItems: NavItem[] = [
  {
    label: "Subscription",
    href: "/subscription",
    icon: CreditCard,
    badge: "Required",
  },
  { label: "Profile", href: "/profile", icon: UserRound },
];

export function navItemsFor(currentUser?: SharedCurrentUser | null): NavItem[] {
  const role = currentUser?.role;
  const isMember = role === "member";
  const isManagerOrAdmin = role === "manager" || role === "admin";
  const billingRequired = Boolean(
    currentUser?.billing_required && isManagerOrAdmin,
  );

  const managerItems =
    currentUser?.current_plan === "pro" ? proManagerNavItems : managerNavItems;

  if (billingRequired) return billingRequiredNavItems;
  if (isMember) return memberNavItems;

  return managerItems;
}

export function logoHrefFor(currentUser?: SharedCurrentUser | null): string {
  return billingRequiredFor(currentUser) ? "/subscription" : "/";
}

export function billingRequiredFor(
  currentUser?: SharedCurrentUser | null,
): boolean {
  const role = currentUser?.role;
  const isManagerOrAdmin = role === "manager" || role === "admin";

  return Boolean(currentUser?.billing_required && isManagerOrAdmin);
}

export function isActive(currentUrl: string, href: string): boolean {
  if (href === "/") return currentUrl === "/";

  return currentUrl.startsWith(href);
}