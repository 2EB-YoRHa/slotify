import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Camera,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import AppLayout from "../../components/AppLayout";
import AccountSettingsNav from "../../components/account/AccountSettingsNav";
import LoadingButton from "../../components/ui/LoadingButton";
import {
  FieldError,
  FieldHint,
  RequiredMark,
  formInputClassName,
  hasFieldError,
} from "../../components/ui/FormFeedback";
import {
  hasValidationErrors,
  validateEmail,
  validateTextLength,
  type ValidationErrors,
} from "../../utils/clientValidation";
import { formatText } from "../../utils/reservationFormUtils";

type ProfileOrganization = {
  id: number;
  name?: string | null;
  slug?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

type UserProfile = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  active?: boolean;
  two_factor_enabled?: boolean;
  avatar_url?: string | null;
  organization?: ProfileOrganization | null;
  created_at?: string | null;
  updated_at?: string | null;
  confirmed?: boolean;
  confirmed_at?: string | null;
  pending_email?: string | null;
};

type ProfileShowProps = {
  profile: UserProfile;
  errors?: Partial<Record<string, string | string[]>>;
};

type ProfileFormData = {
  user: {
    name: string;
    email: string;
    avatar: File | null;
    remove_avatar: boolean;
    current_password: string;
  };
};

export default function ProfileShow({
  profile,
  errors: initialErrors = {},
}: ProfileShowProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
  } = useForm<ProfileFormData>({
    user: {
      name: profile.name || "",
      email: profile.email || "",
      avatar: null,
      remove_avatar: false,
      current_password: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const avatarUrl =
    avatarPreview || (!data.user.remove_avatar ? profile.avatar_url : null);

  const emailChanged =
    data.user.email.trim().toLowerCase() !== profile.email.trim().toLowerCase();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProfileForm(data, emailChanged);

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    patch("/profile", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setAvatarPreview(null);

        setData("user", {
          ...data.user,
          avatar: null,
          remove_avatar: false,
          current_password: "",
        });
      },
    });
  }

  function updateField(
    field: keyof ProfileFormData["user"],
    value: string | boolean | File | null,
  ) {
    clearClientError(field);

    setData("user", {
      ...data.user,
      [field]: value,
    });
  }

  function handleAvatarChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    clearClientError("avatar");

    if (!file) {
      setData("user", {
        ...data.user,
        avatar: null,
      });

      setAvatarPreview(null);
      return;
    }

    setData("user", {
      ...data.user,
      avatar: file,
      remove_avatar: false,
    });

    setAvatarPreview(URL.createObjectURL(file));
  }

  function removeAvatar() {
    clearClientError("avatar");

    setAvatarPreview(null);

    setData("user", {
      ...data.user,
      avatar: null,
      remove_avatar: true,
    });
  }

  function clearClientError(field: string) {
    setClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`user.${field}`];

      return nextErrors;
    });
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        <ProfileHero
          profile={profile}
          avatarUrl={avatarUrl}
          displayName={data.user.name}
          displayEmail={data.user.email}
        />

        <AccountSettingsNav active="profile" />

        <form
          noValidate
          onSubmit={handleSubmit}
          className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]"
        >
          <motion.main
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-8"
          >
            <ProfileInfoSection
              profile={profile}
              data={data}
              errors={errors}
              processing={processing}
              emailChanged={emailChanged}
              onFieldChange={updateField}
            />

            <OrganizationSection profile={profile} />
          </motion.main>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="space-y-6"
          >
            <PhotoActionsCard
              avatarUrl={avatarUrl}
              processing={processing}
              error={fieldError(errors, "avatar")}
              onAvatarChange={handleAvatarChange}
              onRemoveAvatar={removeAvatar}
            />

            <SaveProfileCard
              processing={processing}
              emailChanged={emailChanged}
            />
          </motion.aside>
        </form>
      </div>
    </AppLayout>
  );
}

function ProfileHero({
  profile,
  avatarUrl,
  displayName,
  displayEmail,
}: {
  profile: UserProfile;
  avatarUrl?: string | null;
  displayName: string;
  displayEmail: string;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName || profile.name}
              className="h-28 w-28 rounded-3xl object-cover shadow-sm ring-4 ring-cyan-50"
            />
          ) : (
            <div className="flex h-28 w-28 items-center justify-center rounded-3xl bg-cyan-50 text-4xl font-black text-cyan-500 shadow-sm ring-4 ring-cyan-50">
              {initials(displayName || profile.name)}
            </div>
          )}

          <div>
            <h1 className="text-4xl font-black tracking-tight text-slate-950">
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

        <div className="rounded-2xl bg-slate-50 px-5 py-4">
          <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
            Organization
          </p>

          <p className="mt-1 max-w-xs wrap-break-word text-sm font-black text-slate-950">
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
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black ${classes[tone]}`}
    >
      {tone !== "slate" && <CheckCircle2 size={14} />}
      {label}
    </span>
  );
}

type ProfileSectionProps = {
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

function ProfileInfoSection({
  profile,
  data,
  errors,
  processing,
  emailChanged,
  onFieldChange,
}: ProfileSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <SectionHeader
        title="Account information"
        description="Keep your personal information accurate for your workspace."
      />

      <div className="mt-7 grid gap-5 md:grid-cols-2">
        <TextField
          label="Full Name"
          icon={UserRound}
          value={data.user.name}
          placeholder="Enter your full name"
          disabled={processing}
          error={fieldError(errors, "name")}
          onChange={(value) => onFieldChange("name", value)}
        />

        <TextField
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
            <TextField
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

function OrganizationSection({ profile }: { profile: UserProfile }) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <SectionHeader
        title="Organization details"
        description="This information comes from the organization connected to your account."
      />

      <div className="mt-7 grid gap-4 md:grid-cols-2">
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

function DetailCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
      <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
        {label}
      </p>

      <p className="mt-2 wrap-break-word text-sm font-black text-slate-950">
        {value}
      </p>
    </div>
  );
}

function PhotoActionsCard({
  avatarUrl,
  processing,
  error,
  onAvatarChange,
  onRemoveAvatar,
}: {
  avatarUrl?: string | null;
  processing: boolean;
  error?: string | string[];
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
          <Camera size={19} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-lg font-black text-slate-950">Photo</h2>

          <p className="text-sm font-semibold text-slate-500">
            PNG, JPG, JPEG or WEBP.
          </p>
        </div>
      </div>

      <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50">
        <UploadCloud size={17} />
        Upload Photo
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          disabled={processing}
          onChange={onAvatarChange}
          className="hidden"
        />
      </label>

      {avatarUrl && (
        <button
          type="button"
          disabled={processing}
          onClick={onRemoveAvatar}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-5 py-3 text-sm font-black text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Trash2 size={17} />
          Remove Photo
        </button>
      )}

      <FieldError error={error} label="Profile Photo" />
      <FieldHint>Maximum file size is 5MB.</FieldHint>
    </section>
  );
}

function SaveProfileCard({
  processing,
  emailChanged,
}: {
  processing: boolean;
  emailChanged: boolean;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <LoadingButton
        type="submit"
        loading={processing}
        loadingText="Saving..."
        className="w-full rounded-2xl py-4"
      >
        Save Profile
      </LoadingButton>

      <p className="mt-4 text-xs font-semibold leading-5 text-slate-400">
        {emailChanged
          ? "Changing email requires your current password and email confirmation."
          : "Profile changes are saved to your current account."}
      </p>
    </section>
  );
}

function SectionHeader({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <h2 className="text-2xl font-black text-slate-950">{title}</h2>

      <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
        {description}
      </p>
    </div>
  );
}

type TextFieldProps = {
  label: string;
  icon: LucideIcon;
  value: string;
  placeholder: string;
  type?: string;
  disabled: boolean;
  required?: boolean;
  error?: string | string[];
  helper?: string;
  onChange: (value: string) => void;
};

function TextField({
  label,
  icon: Icon,
  value,
  placeholder,
  type = "text",
  disabled,
  required = true,
  error,
  helper,
  onChange,
}: TextFieldProps) {
  const hasError = hasFieldError(error);

  return (
    <label className="block">
      <span className="mb-2 flex items-center gap-1 text-sm font-bold text-slate-700">
        {label}
        <RequiredMark show={required} />
      </span>

      <div className="relative">
        <Icon
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type={type}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(event) => onChange(event.target.value)}
          className={`h-12 ${formInputClassName(hasError)}`}
          autoComplete={autoCompleteFor(label, type)}
        />
      </div>

      <FieldError error={error} label={label} />
      <FieldHint>{helper}</FieldHint>
    </label>
  );
}

function validateProfileForm(
  data: ProfileFormData,
  emailChanged: boolean,
): ValidationErrors {
  const errors: ValidationErrors = {};

  const nameError = validateTextLength(data.user.name, "Full Name", {
    min: 2,
    max: 80,
  });

  if (nameError) errors.name = nameError;

  const emailError = validateEmail(data.user.email, "Email", {
    required: true,
  });

  if (emailError) errors.email = emailError;

  if (emailChanged && data.user.current_password.trim().length === 0) {
    errors.current_password = "Current Password is required.";
  }

  if (data.user.avatar) {
    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];

    if (!allowedTypes.includes(data.user.avatar.type)) {
      errors.avatar = "Profile Photo must be a PNG, JPG, JPEG, or WEBP image.";
    }

    if (data.user.avatar.size > 5 * 1024 * 1024) {
      errors.avatar = "Profile Photo must be less than 5MB.";
    }
  }

  return errors;
}

function fieldError(
  errors: Record<string, string | string[] | undefined>,
  field: string,
): string | string[] | undefined {
  return errors[field] || errors[`user.${field}`];
}

function initials(name?: string | null): string {
  if (!name) return "?";

  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function autoCompleteFor(label: string, type: string): string {
  if (label === "Email") return "email";
  if (label === "Full Name") return "name";
  if (label === "Current Password") return "current-password";
  if (type === "password") return "new-password";

  return "off";
}