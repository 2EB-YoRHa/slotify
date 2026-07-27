import { usePage } from "@inertiajs/react";
import { AnimatePresence, motion } from "motion/react";
import { useNavigationLoading } from "../../utils/navigationLoading";
import {
  AmenitiesSkeleton,
  DashboardSkeleton,
  DefaultPageSkeleton,
  MemberProfileSkeleton,
  NewReservationSkeleton,
  OrganizationSkeleton,
  ReservationsSkeleton,
  SubscriptionSkeleton,
  WorkspacesSkeleton,
} from "./Skeleton";

export default function NavigationLoadingOverlay() {
  const { loading, path, method } = useNavigationLoading();
  const { url } = usePage();

  const currentPath = normalizePath(url);
  const shouldShow = loading && method === "get" && path !== currentPath;

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed bottom-0 left-64 right-0 top-16 z-[80] overflow-hidden bg-slate-50/95 p-8 backdrop-blur-sm"
        >
          {skeletonForPath(path)}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function skeletonForPath(path: string) {
  if (path === "/") return <DashboardSkeleton />;

  if (path.startsWith("/workspaces")) return <WorkspacesSkeleton />;

  if (path === "/reservations/new") return <NewReservationSkeleton />;

  if (path.startsWith("/reservations") || path === "/my_reservations") {
    return <ReservationsSkeleton />;
  }

  if (path.startsWith("/organization/members")) {
    return <MemberProfileSkeleton />;
  }

  if (path.startsWith("/organization")) return <OrganizationSkeleton />;

  if (path.startsWith("/amenities")) return <AmenitiesSkeleton />;

  if (path.startsWith("/subscription")) return <SubscriptionSkeleton />;

  return <DefaultPageSkeleton />;
}

function normalizePath(value: string): string {
  return value.split("?")[0] || "/";
}