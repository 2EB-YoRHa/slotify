import { useState } from "react";
import { Send } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import HeaderActionButton from "../../components/ui/HeaderActionButton";
import InviteMemberModal from "../../components/organizations/InviteMemberModal";
import OrganizationProfileCard from "../../components/organizations/show/OrganizationProfileCard";
import OrganizationSidePanels from "../../components/organizations/show/OrganizationSidePanels";
import OrganizationStatsGrid from "../../components/organizations/show/OrganizationStatsGrid";
import OrganizationTeamSection from "../../components/organizations/show/OrganizationTeamSection";
import type {
  BookingRuleSummary,
  OrganizationShowData,
  OrganizationShowInvitation,
  OrganizationShowRole,
  OrganizationShowUser,
  SubscriptionSummary,
} from "../../types/organizationShowTypes";

type OrganizationShowProps = {
  organization: OrganizationShowData;
  users?: OrganizationShowUser[];
  roles?: OrganizationShowRole[];
  invitations?: OrganizationShowInvitation[];
  booking_rule?: BookingRuleSummary | null;
  subscription?: SubscriptionSummary | null;
  can_manage_organization?: boolean;
};

export default function OrganizationShow({
  organization,
  users = [],
  roles = [],
  invitations = [],
  booking_rule = null,
  subscription = null,
  can_manage_organization = false,
}: OrganizationShowProps) {
  const [inviteOpen, setInviteOpen] = useState(false);

  return (
    <AppLayout
      headerActions={
        can_manage_organization ? (
          <HeaderActionButton icon={Send} onClick={() => setInviteOpen(true)}>
            Invite Member
          </HeaderActionButton>
        ) : null
      }
    >
      <OrganizationStatsGrid
        users={users}
        invitations={invitations}
        subscription={subscription}
      />

      <section className="mb-8 grid grid-cols-3 gap-8">
        <OrganizationProfileCard
          organization={organization}
          canManageOrganization={can_manage_organization}
        />

        <OrganizationSidePanels
          bookingRule={booking_rule}
          subscription={subscription}
        />
      </section>

      <OrganizationTeamSection
        users={users}
        invitations={invitations}
        canManageOrganization={can_manage_organization}
      />

      <InviteMemberModal
        open={inviteOpen}
        roles={roles}
        onClose={() => setInviteOpen(false)}
      />
    </AppLayout>
  );
}
