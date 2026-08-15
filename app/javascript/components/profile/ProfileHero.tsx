import { CheckCircle2 } from "lucide-react";
import type { UserProfile } from "../../types/profile";
import { initials } from "../../utils/profileForm";
import { formatText } from "../../utils/reservationFormUtils";

type ProfileHeroProps = {
  profile: UserProfile;
  avatarUrl?: string | null;
  displayName: string;
  displayEmail: string;
};

export default function ProfileHero({
  profile,
  avatarUrl,
  displayName,
  displayEmail,
}: ProfileHeroProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex min-w-0 flex-col gap-5 sm:flex-row sm:items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || profile.name}
              className="h-24 w-24 shrink-0 rounded-3xl object-cover shadow-sm ring-4 ring-cyan-50 sm:h-28 sm:w-28"
            />
          ) : (
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-cyan-50 text-3xl font-black text-cyan-500 shadow-sm ring-4 ring-cyan-50 sm:h-28 sm:w-28 sm:text-4xl">
              {initials(displayName || profile.name)}
            </div>
          )}

          <div className="min-w-0">
            <h1 className="wrap-break-word text-2xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {displayName || profile.name}
            </h1>

            <p className="mt-2 break-all text-sm font-semibold text-slate-500">
              {displayEmail || profile.email}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <ProfilePill label={formatText(profile.role)} />

              <ProfilePill
                label={profile.active ? "Active" : "Inactive"}
                tone={profile.active ? "green" : "amber"}
              />

              <ProfilePill
                label={profile.confirmed ? "Email confirmed" : "Email pending"}
                tone={profile.confirmed ? "cyan" : "amber"}
              />
            </div>
          </div>
        </div>

        <div className="w-full rounded-2xl bg-slate-50 px-5 py-4 xl:w-auto xl:min-w-64">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Organization
          </p>

          <p className="mt-1 wrap-break-word text-sm font-black text-slate-950">
            {profile.organization?.name || "No organization"}
          </p>
        </div>
      </div>
    </section>
  );
}

function ProfilePill({
  label,
  tone = "slate",
}: {
  label: string;
  tone?: "slate" | "cyan" | "green" | "amber";
}) {
  const classes = {
    slate: "bg-slate-100 text-slate-600",
    cyan: "bg-cyan-50 text-cyan-600",
    green: "bg-green-50 text-green-600",
    amber: "bg-amber-50 text-amber-600",
  };

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${classes[tone]}`}
    >
      {tone !== "slate" && <CheckCircle2 size={14} className="shrink-0" />}
      <span className="truncate">{label}</span>
    </span>
  );
}