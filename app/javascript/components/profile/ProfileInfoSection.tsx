import { LockKeyhole, Mail, UserRound } from "lucide-react";
import type { ProfileFormData, UserProfile } from "../../types/profile";
import { fieldError } from "../../utils/profileForm";
import { ProfileTextField, SectionHeader } from "./ProfileShared";

type ProfileInfoSectionProps = {
  data: ProfileFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  emailChanged: boolean;
  profile: UserProfile;
  onFieldChange: (
    field: keyof ProfileFormData["user"],
    value: string | boolean | File | null,
  ) => void;
};

export default function ProfileInfoSection({
  profile,
  data,
  errors,
  processing,
  emailChanged,
  onFieldChange,
}: ProfileInfoSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <SectionHeader
        title="Account information"
        description="Keep your personal information accurate for your workspace."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <ProfileTextField
          label="Full Name"
          icon={UserRound}
          value={data.user.name}
          placeholder="Enter your full name"
          disabled={processing}
          error={fieldError(errors, "name")}
          onChange={(value) => onFieldChange("name", value)}
        />

        <ProfileTextField
          label="Email"
          icon={Mail}
          type="email"
          value={data.user.email}
          placeholder="Enter your email"
          disabled={processing}
          error={fieldError(errors, "email")}
          onChange={(value) => onFieldChange("email", value)}
        />
      </div>

      {profile.pending_email && (
        <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
          <p className="text-sm font-black text-amber-800">
            Pending email confirmation
          </p>

          <p className="mt-2 text-sm font-semibold leading-6 text-amber-700">
            A confirmation email was sent to{" "}
            <span className="font-black">{profile.pending_email}</span>. Your
            current login email remains active until the new address is
            confirmed.
          </p>
        </div>
      )}

      {emailChanged && (
        <div className="mt-6 rounded-2xl border border-cyan-100 bg-cyan-50 p-5">
          <p className="text-sm font-black text-slate-950">
            Confirm this email change
          </p>

          <p className="mt-1 text-sm font-semibold leading-6 text-cyan-700">
            Enter your current password to request the email update.
          </p>

          <div className="mt-4 max-w-md">
            <ProfileTextField
              label="Current Password"
              icon={LockKeyhole}
              type="password"
              value={data.user.current_password}
              placeholder="Required to change email"
              disabled={processing}
              error={fieldError(errors, "current_password")}
              helper="Your password is required only when changing email."
              onChange={(value) => onFieldChange("current_password", value)}
            />
          </div>
        </div>
      )}
    </section>
  );
}