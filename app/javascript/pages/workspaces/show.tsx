import { usePage } from "@inertiajs/react";
import { motion } from "motion/react";
import AppLayout from "../../components/AppLayout";
import WorkspacePhoto from "../../components/workspaces/WorkspacePhoto";
import RecentReservations from "../../components/workspaces/show/RecentReservations";
import WorkspaceAmenities from "../../components/workspaces/show/WorkspaceAmenities";
import WorkspaceHeader from "../../components/workspaces/show/WorkspaceHeader";
import WorkspaceInformation from "../../components/workspaces/show/WorkspaceInformation";
import WorkspaceStats from "../../components/workspaces/show/WorkspaceStats";
import WorkspaceSummaryPanel from "../../components/workspaces/show/WorkspaceSummaryPanel";
import type {
  WorkspaceReservation,
  WorkspaceWithAmenities,
} from "../../types/workspaceShowTypes";

type CurrentUser = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
};

type SharedPageProps = {
  current_user?: CurrentUser | null;
};

type WorkspaceShowProps = {
  workspace: WorkspaceWithAmenities;
  reservations?: WorkspaceReservation[];
  reservation_count?: number;
};

export default function WorkspaceShow({
  workspace,
  reservations = [],
  reservation_count = 0,
}: WorkspaceShowProps) {
  const { current_user } = usePage<SharedPageProps>().props;
  const isMember = current_user?.role === "member";
  const activeLabel = workspace.active ? "Active" : "Inactive";
  const amenities = workspace.amenities || [];

  return (
    <AppLayout>
      <WorkspaceHeader workspace={workspace} isMember={isMember} />

      <WorkspaceStats workspace={workspace} activeLabel={activeLabel} />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-6 xl:col-span-2 xl:space-y-8"
        >
          <WorkspacePhoto
            name={workspace.name}
            photoUrl={workspace.photo_url}
            galleryPhotos={workspace.gallery_photos}
            fit="contain"
            position="object-center"
            showThumbnails
            className="h-64 rounded-2xl border border-slate-200 bg-slate-100 shadow-sm sm:h-96 xl:h-130"
          />

          <WorkspaceInformation workspace={workspace} />

          <WorkspaceAmenities amenities={amenities} isMember={isMember} />

          {!isMember && <RecentReservations reservations={reservations} />}
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6 xl:sticky xl:top-24 xl:self-start"
        >
          <WorkspaceSummaryPanel
            workspace={workspace}
            activeLabel={activeLabel}
            reservationCount={reservation_count}
            isMember={isMember}
          />
        </motion.aside>
      </section>
    </AppLayout>
  );
}