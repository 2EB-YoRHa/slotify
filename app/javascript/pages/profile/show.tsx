import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import {
  Building2,
  Camera,
  CheckCircle2,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import PasswordChecklist from "../../components/auth/PasswordChecklist";
import AppLayout from "../../components/AppLayout";
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
  validatePasswordConfirmation,
  validatePasswordStrength,
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
  avatar_url?: string | null;
  organization?: ProfileOrganization | null;
  created_at?: string | null;
  updated_at?: string | null;
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
    password: string;
    password_confirmation: string;
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
      password: "",
      password_confirmation: "",
    },
  });

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const avatarUrl =
    avatarPreview || (!data.user.remove_avatar ? profile.avatar_url : null);

  const passwordRequested =
    data.user.password.length > 0 || data.user.password_confirmation.length > 0;

  const emailChanged = data.user.email.trim().toLowerCase() !== profile.email;

  const currentPasswordRequired = passwordRequested || emailChanged;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProfileForm(
      data,
      currentPasswordRequired,
      passwordRequested,
    );

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
          password: "",
          password_confirmation: "",
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
      <div className="mb-8 flex items-start justify-between gap-8">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-extrabold text-slate-950"
          >
            My Profile
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mt-2 max-w-2xl text-sm leading-6 text-slate-500"
          >
            Update your personal information, profile photo, email, and
            password.
          </motion.p>
        </div>

        <ProfileStatusCard profile={profile} />
      </div>

      <form
        noValidate
        onSubmit={handleSubmit}
        className="grid grid-cols-3 gap-8"
      >
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="col-span-2 space-y-8"
        >
          <ProfileInfoSection
            data={data}
            errors={errors}
            processing={processing}
            currentPasswordRequired={currentPasswordRequired}
            passwordRequested={passwordRequested}
            onFieldChange={updateField}
          />

          <PasswordSection
            data={data}
            errors={errors}
            processing={processing}
            passwordRequested={passwordRequested}
            onFieldChange={updateField}
          />
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="space-y-8"
        >
          <AvatarSection
            profile={profile}
            avatarUrl={avatarUrl}
            processing={processing}
            error={fieldError(errors, "avatar")}
            onAvatarChange={handleAvatarChange}
            onRemoveAvatar={removeAvatar}
          />

          <OrganizationSummary profile={profile} />

          <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <LoadingButton
              type="submit"
              loading={processing}
              loadingText="Saving..."
              className="w-full"
            >
              Save Profile
            </LoadingButton>

            <p className="mt-4 text-xs font-semibold leading-5 text-slate-400">
              Email or password changes require your current password for
              account security.
            </p>
          </div>
        </motion.aside>
      </form>
    </AppLayout>
  );
}

type ProfileSectionProps = {
  data: ProfileFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  currentPasswordRequired?: boolean;
  passwordRequested: boolean;
  onFieldChange: (
    field: keyof ProfileFormData["user"],
    value: string | boolean | File | null,
  ) => void;
};

function ProfileInfoSection({
  data,
  errors,
  processing,
  currentPasswordRequired = false,
  onFieldChange,
}: ProfileSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <SectionHeader
        icon={UserRound}
        title="Account Information"
        description="Keep your name and email address up to date."
      />

      <div className="grid grid-cols-2 gap-5">
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

      <div className="mt-5">
        <TextField
          label="Current Password"
          icon={LockKeyhole}
          type="password"
          value={data.user.current_password}
          placeholder={
            currentPasswordRequired
              ? "Required to change email or password"
              : "Only needed when changing email or password"
          }
          disabled={processing}
          required={currentPasswordRequired}
          error={fieldError(errors, "current_password")}
          helper="Required only when changing your email address or password."
          onChange={(value) => onFieldChange("current_password", value)}
        />
      </div>
    </section>
  );
}

function PasswordSection({
  data,
  errors,
  processing,
  passwordRequested,
  onFieldChange,
}: ProfileSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <SectionHeader
        icon={ShieldCheck}
        title="Password"
        description="Create a new password only when you want to change it."
      />

      <div className="grid grid-cols-2 gap-5">
        <TextField
          label="New Password"
          icon={LockKeyhole}
          type="password"
          value={data.user.password}
          placeholder="Create a new password"
          disabled={processing}
          required={passwordRequested}
          error={fieldError(errors, "password")}
          onChange={(value) => onFieldChange("password", value)}
        />

        <TextField
          label="Confirm Password"
          icon={LockKeyhole}
          type="password"
          value={data.user.password_confirmation}
          placeholder="Confirm the new password"
          disabled={processing}
          required={passwordRequested}
          error={fieldError(errors, "password_confirmation")}
          onChange={(value) => onFieldChange("password_confirmation", value)}
        />
      </div>

      <div className="mt-5">
        <PasswordChecklist
          password={data.user.password}
          passwordConfirmation={data.user.password_confirmation}
        />
      </div>
    </section>
  );
}

type AvatarSectionProps = {
  profile: UserProfile;
  avatarUrl?: string | null;
  processing: boolean;
  error?: string | string[];
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
};

function AvatarSection({
  profile,
  avatarUrl,
  processing,
  error,
  onAvatarChange,
  onRemoveAvatar,
}: AvatarSectionProps) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Camera size={20} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Profile Photo
          </h2>

          <p className="text-sm text-slate-500">PNG, JPG, JPEG or WEBP.</p>
        </div>
      </div>

      <div className="flex flex-col items-center rounded-2xl bg-slate-50 p-6 text-center">
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt={profile.name}
            className="h-32 w-32 rounded-3xl object-cover shadow-sm ring-4 ring-white"
          />
        ) : (
          <div className="flex h-32 w-32 items-center justify-center rounded-3xl bg-cyan-50 text-4xl font-black text-cyan-500 shadow-sm ring-4 ring-white">
            {initials(profile.name)}
          </div>
        )}

        <p className="mt-4 text-sm font-extrabold text-slate-950">
          {profile.name}
        </p>

        <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
          {formatText(profile.role)}
        </p>
      </div>

      <label className="mt-5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50">
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
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-5 py-3 text-sm font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
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

function OrganizationSummary({ profile }: { profile: UserProfile }) {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
          <Building2 size={20} strokeWidth={2.4} />
        </div>

        <div>
          <h2 className="text-lg font-extrabold text-slate-950">
            Organization
          </h2>

          <p className="text-sm text-slate-500">Your account workspace.</p>
        </div>
      </div>

      <div className="rounded-2xl bg-slate-50 p-5">
        <SummaryRow
          label="Organization"
          value={profile.organization?.name || "-"}
        />
        <SummaryRow label="Role" value={formatText(profile.role)} />
        <SummaryRow
          label="Status"
          value={profile.active ? "Active" : "Inactive"}
        />
      </div>
    </section>
  );
}

function ProfileStatusCard({ profile }: { profile: UserProfile }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex shrink-0 items-center gap-3 rounded-2xl border border-cyan-100 bg-white px-5 py-4 shadow-sm"
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-50 text-cyan-500">
        <CheckCircle2 size={21} strokeWidth={2.4} />
      </div>

      <div>
        <p className="text-xs font-extrabold uppercase tracking-wide text-slate-400">
          Account Status
        </p>

        <p className="text-base font-extrabold text-slate-950">
          {profile.active ? "Active" : "Inactive"}
        </p>

        <p className="mt-1 text-xs font-bold text-cyan-600">
          {formatText(profile.role)}
        </p>
      </div>
    </motion.div>
  );
}

function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-7 flex items-start gap-4">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500">
        <Icon size={26} strokeWidth={2.4} />
      </div>

      <div>
        <h2 className="text-2xl font-bold text-slate-950">{title}</h2>

        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-slate-200 py-3 last:border-0">
      <span className="text-sm text-slate-500">{label}</span>

      <span className="text-right text-sm font-bold text-slate-950">
        {value}
      </span>
    </div>
  );
}

function validateProfileForm(
  data: ProfileFormData,
  currentPasswordRequired: boolean,
  passwordRequested: boolean,
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

  if (
    currentPasswordRequired &&
    data.user.current_password.trim().length === 0
  ) {
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

  if (passwordRequested) {
    const passwordError = validatePasswordStrength(
      data.user.password,
      "New Password",
    );

    if (passwordError) errors.password = passwordError;

    const confirmationError = validatePasswordConfirmation(
      data.user.password,
      data.user.password_confirmation,
      "Confirm Password",
    );

    if (confirmationError) errors.password_confirmation = confirmationError;
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
  if (type === "password") return "new-password";

  return "off";
}
