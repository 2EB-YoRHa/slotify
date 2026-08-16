import { router } from "@inertiajs/react";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import OrganizationMemberHeader from "../../components/organization_members/show/OrganizationMemberHeader";
import OrganizationMemberProfileCard from "../../components/organization_members/show/OrganizationMemberProfileCard";
import OrganizationMemberReservations from "../../components/organization_members/show/OrganizationMemberReservations";
import OrganizationMemberSidePanels from "../../components/organization_members/show/OrganizationMemberSidePanels";
import OrganizationMemberStats from "../../components/organization_members/show/OrganizationMemberStats";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import type {
  MemberReservation,
  OrganizationMember,
} from "../../types/organizationMemberShowTypes";

type OrganizationMemberShowProps = {
  member: OrganizationMember;
  reservations?: MemberReservation[];
  reservation_count?: number;
  can_toggle_access?: boolean;
};

export default function OrganizationMemberShow({
  member,
  reservations = [],
  reservation_count = 0,
  can_toggle_access = false,
}: OrganizationMemberShowProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  function toggleAccess() {
    setProcessing(true);

    router.patch(
      `/organization/members/${member.id}/toggle_active`,
      {},
      {
        onFinish: () => {
          setProcessing(false);
          setConfirmOpen(false);
        },
      },
    );
  }

  return (
    <AppLayout>
      <OrganizationMemberHeader member={member} />

      {!can_toggle_access && (
        <div className="mb-6 rounded-xl border border-yellow-100 bg-yellow-50 p-4 text-sm font-semibold leading-6 text-yellow-700 sm:mb-8 sm:p-5">
          You cannot deactivate your own account.
        </div>
      )}

      <OrganizationMemberStats
        member={member}
        reservationCount={reservation_count}
      />

      <section className="grid grid-cols-1 gap-6 xl:grid-cols-3 xl:gap-8">
        <div className="min-w-0 space-y-6 xl:col-span-2 xl:space-y-8">
          <OrganizationMemberProfileCard
            member={member}
            reservationCount={reservation_count}
          />

          <OrganizationMemberReservations reservations={reservations} />
        </div>

        <OrganizationMemberSidePanels
          member={member}
          reservationCount={reservation_count}
          canToggleAccess={can_toggle_access}
          onOpenConfirm={() => setConfirmOpen(true)}
        />
      </section>

      <ConfirmDialog
        open={confirmOpen}
        title={member.active ? "Deactivate member?" : "Activate member?"}
        description={
          member.active
            ? `This will prevent ${member.name} from signing in to Slotify. Their reservations will remain in the system.`
            : `This will allow ${member.name} to sign in to Slotify again.`
        }
        confirmText={member.active ? "Deactivate Access" : "Activate Access"}
        cancelText="Cancel"
        danger={member.active}
        processing={processing}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={toggleAccess}
      />
    </AppLayout>
  );
}