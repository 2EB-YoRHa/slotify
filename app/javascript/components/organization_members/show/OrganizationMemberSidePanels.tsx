import { motion } from "motion/react";
import { Power, PowerOff, UserRound } from "lucide-react";
import LoadingButton from "../../ui/LoadingButton";
import {
  formatMemberText,
  SidePanel,
  SummaryRow,
} from "./OrganizationMemberShowShared";
import type { OrganizationMember } from "../../../types/organizationMemberShowTypes";

type OrganizationMemberSidePanelsProps = {
  member: OrganizationMember;
  reservationCount: number;
  canToggleAccess: boolean;
  onOpenConfirm: () => void;
};

export default function OrganizationMemberSidePanels({
  member,
  reservationCount,
  canToggleAccess,
  onOpenConfirm,
}: OrganizationMemberSidePanelsProps) {
  return (
    <motion.aside
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.22 }}
      className="space-y-6 xl:sticky xl:top-24 xl:self-start"
    >
      <AccessControlPanel
        member={member}
        canToggleAccess={canToggleAccess}
        onOpenConfirm={onOpenConfirm}
      />

      <MemberSummaryPanel member={member} reservationCount={reservationCount} />
    </motion.aside>
  );
}

type AccessControlPanelProps = {
  member: OrganizationMember;
  canToggleAccess: boolean;
  onOpenConfirm: () => void;
};

function AccessControlPanel({
  member,
  canToggleAccess,
  onOpenConfirm,
}: AccessControlPanelProps) {
  return (
    <SidePanel title="Access Control" icon={member.active ? Power : PowerOff}>
      <p className="text-sm leading-6 text-slate-500 dark:text-slate-400">
        Deactivating a member prevents them from signing in, but keeps their
        historical reservations available for reports and audit.
      </p>

      {canToggleAccess ? (
        <LoadingButton
          type="button"
          variant={member.active ? "danger" : "primary"}
          loading={false}
          onClick={onOpenConfirm}
          className="mt-6 w-full"
        >
          {member.active ? "Deactivate Access" : "Activate Access"}
        </LoadingButton>
      ) : (
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-500 transition-colors dark:bg-slate-800/60 dark:text-slate-400">
          You cannot disable your own access.
        </div>
      )}
    </SidePanel>
  );
}

type MemberSummaryPanelProps = {
  member: OrganizationMember;
  reservationCount: number;
};

function MemberSummaryPanel({
  member,
  reservationCount,
}: MemberSummaryPanelProps) {
  return (
    <SidePanel title="Member Summary" icon={UserRound}>
      <SummaryRow label="Name" value={member.name} />

      <SummaryRow label="Role" value={formatMemberText(member.role?.name)} />

      <SummaryRow
        label="Status"
        value={member.active ? "Active" : "Inactive"}
      />

      <SummaryRow label="Bookings" value={reservationCount} />
    </SidePanel>
  );
}