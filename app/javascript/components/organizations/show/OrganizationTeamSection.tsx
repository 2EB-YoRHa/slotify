import OrganizationMembersTable from "../OrganizationMembersTable";
import OrganizationInvitationsList from "../OrganizationInvitationsList";
import type {
  OrganizationShowInvitation,
  OrganizationShowUser,
} from "../../../types/organizationShowTypes";

type OrganizationTeamSectionProps = {
  users: OrganizationShowUser[];
  invitations: OrganizationShowInvitation[];
  canManageOrganization: boolean;
};

export default function OrganizationTeamSection({
  users,
  invitations,
  canManageOrganization,
}: OrganizationTeamSectionProps) {
  const pendingInvitations = invitations.filter(
    (invitation) => invitation.status === "pending",
  );

  return (
    <div className="space-y-6 xl:space-y-8">
      <OrganizationMembersTable
        users={users}
        canManage={canManageOrganization}
      />

      <OrganizationInvitationsList
        invitations={pendingInvitations}
        canManage={canManageOrganization}
      />
    </div>
  );
}