import type { UserProfile } from "../../types/profile";
import { formatText } from "../../utils/reservationFormUtils";
import { DetailCard, SectionHeader } from "./ProfileShared";

export default function ProfileOrganizationSection({
  profile,
}: {
  profile: UserProfile;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
      <SectionHeader
        title="Organization details"
        description="This information comes from the organization connected to your account."
      />

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <DetailCard
          label="Organization"
          value={profile.organization?.name || "No organization"}
        />

        <DetailCard label="Role" value={formatText(profile.role)} />

        <DetailCard
          label="Account status"
          value={profile.active ? "Active" : "Inactive"}
        />

        <DetailCard
          label="Email status"
          value={profile.confirmed ? "Confirmed" : "Pending confirmation"}
        />

        <DetailCard
          label="Organization email"
          value={profile.organization?.email || "-"}
        />

        <DetailCard
          label="Organization phone"
          value={profile.organization?.phone || "-"}
        />
      </div>
    </section>
  );
}