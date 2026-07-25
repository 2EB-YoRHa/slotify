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
  const { loading, path } = useNavigationLoading();

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="pointer-events-none fixed bottom-0 left-64 right-0 top-16 z-[80] overflow-hidden bg-slate-50/95 p-8 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <LoadingLabel path={path} />

            <RouteSkeleton path={path} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RouteSkeleton({ path }: { path: string }) {
  if (path === "/" || path.startsWith("/dashboard")) {
    return <DashboardSkeleton />;
  }

  if (path.startsWith("/workspaces")) {
    return <WorkspacesSkeleton />;
  }

  if (path.startsWith("/reservations/new")) {
    return <NewReservationSkeleton />;
  }

  if (path.startsWith("/reservations") || path.startsWith("/my_reservations")) {
    return <ReservationsSkeleton />;
  }

  if (path.startsWith("/organization/members")) {
    return <MemberProfileSkeleton />;
  }

  if (path.startsWith("/organization")) {
    return <OrganizationSkeleton />;
  }

  if (path.startsWith("/amenities")) {
    return <AmenitiesSkeleton />;
  }

  if (path.startsWith("/subscription")) {
    return <SubscriptionSkeleton />;
  }

  return <DefaultPageSkeleton />;
}

function LoadingLabel({ path }: { path: string }) {
  return (
    <div className="mb-5 flex items-center gap-3 text-sm font-bold text-cyan-500">
      <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
      Loading {labelForPath(path)}...
    </div>
  );
}

function labelForPath(path: string): string {
  if (path === "/" || path.startsWith("/dashboard")) return "dashboard";
  if (path.startsWith("/workspaces")) return "workspaces";
  if (path.startsWith("/reservations/new")) return "reservation form";
  if (path.startsWith("/reservations")) return "reservations";
  if (path.startsWith("/my_reservations")) return "my bookings";
  if (path.startsWith("/organization/members")) return "member profile";
  if (path.startsWith("/organization")) return "organization";
  if (path.startsWith("/amenities")) return "amenities";
  if (path.startsWith("/subscription")) return "subscription";

  return "page";
}