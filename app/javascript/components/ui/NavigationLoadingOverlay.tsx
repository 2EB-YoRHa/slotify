import { usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigationLoading } from "../../utils/navigationLoading";
import {
  AmenitiesSkeleton,
  BookingRulesSkeleton,
  DashboardSkeleton,
  DefaultPageSkeleton,
  MemberProfileSkeleton,
  MyBookingsSkeleton,
  NewReservationSkeleton,
  OrganizationSkeleton,
  ReservationsSkeleton,
  SubscriptionSkeleton,
  TimeSlotsSkeleton,
  WorkspacesSkeleton,
} from "./Skeleton";

export default function NavigationLoadingOverlay() {
  const { loading, path, method } = useNavigationLoading();
  const { url } = usePage();

  const currentPath = normalizePath(url);
  const nextPath = normalizePath(path);
  const shouldShow = loading && method === "get" && nextPath !== currentPath;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-0 left-0 right-0 top-16 z-80 overflow-y-auto overflow-x-hidden bg-slate-50/95 p-4 backdrop-blur-sm transition-colors dark:bg-slate-950/95 sm:p-6 lg:left-64 lg:p-8"
        >
          {skeletonForPath(nextPath)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function skeletonForPath(path: string) {
  if (path === "/") return <DashboardSkeleton />;

  if (path === "/my_reservations") return <MyBookingsSkeleton />;

  if (path.startsWith("/booking_time_slots")) return <TimeSlotsSkeleton />;

  if (path.startsWith("/booking_rules")) return <BookingRulesSkeleton />;

  if (path.startsWith("/workspaces")) return <WorkspacesSkeleton />;

  if (path === "/reservations/new") return <NewReservationSkeleton />;

  if (path.startsWith("/reservations")) return <ReservationsSkeleton />;

  if (path.startsWith("/organization/members")) {
    return <MemberProfileSkeleton />;
  }

  if (path.startsWith("/organization")) return <OrganizationSkeleton />;

  if (path.startsWith("/amenities")) return <AmenitiesSkeleton />;

  if (path.startsWith("/subscription")) return <SubscriptionSkeleton />;

  if (path.startsWith("/profile")) return <MemberProfileSkeleton />;

  return <DefaultPageSkeleton />;
}

function normalizePath(value: string): string {
  return value.split("?")[0] || "/";
}