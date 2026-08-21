import { useForm } from "@inertiajs/react";
import { motion } from "motion/react";
import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import AppLayout from "../../components/AppLayout";
import AccountSettingsNav from "../../components/account/AccountSettingsNav";
import ProfileHero from "../../components/profile/ProfileHero";
import ProfileInfoSection from "../../components/profile/ProfileInfoSection";
import ProfileOrganizationSection from "../../components/profile/ProfileOrganizationSection";
import ProfilePhotoActionsCard from "../../components/profile/ProfilePhotoActionsCard";
import ProfileSaveCard from "../../components/profile/ProfileSaveCard";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import useUnsavedChangesGuard from "../../hooks/useUnsavedChangesGuard";
import type { ProfileFormData, UserProfile } from "../../types/profile";
import {
  buildInitialProfileData,
  fieldError,
  profileFormChanged,
  validateProfileForm,
} from "../../utils/profileForm";
import {
  hasValidationErrors,
  type ValidationErrors,
} from "../../utils/clientValidation";

type ProfileShowProps = {
  profile: UserProfile;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function ProfileShow({
  profile,
  errors: initialErrors = {},
}: ProfileShowProps) {
  const [clientErrors, setClientErrors] = useState<ValidationErrors>({});
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [removePhotoConfirmOpen, setRemovePhotoConfirmOpen] = useState(false);
  const [saveProfileConfirmOpen, setSaveProfileConfirmOpen] = useState(false);

  const initialProfileData = buildInitialProfileData(profile);

  const {
    data,
    setData,
    patch,
    processing,
    errors: formErrors,
  } = useForm<ProfileFormData>(initialProfileData);

  const errors: Record<string, string | string[] | undefined> = {
    ...initialErrors,
    ...formErrors,
    ...clientErrors,
  };

  const avatarUrl =
    avatarPreview || (!data.user.remove_avatar ? profile.avatar_url : null);

  const emailChanged =
    data.user.email.trim().toLowerCase() !== profile.email.trim().toLowerCase();

  const profileDirty = profileFormChanged(data, initialProfileData);

  const unsavedChangesGuard = useUnsavedChangesGuard({
    enabled: profileDirty && !processing,
    title: "Discard profile changes?",
    description:
      "You have unsaved profile changes. If you leave now, those changes will be lost.",
    confirmText: "Discard Changes",
    cancelText: "Keep Editing",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateProfileForm(data, emailChanged);

    setClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    setSaveProfileConfirmOpen(true);
  }

  function submitProfileUpdate() {
    unsavedChangesGuard.allowNextNavigation();

    patch("/profile", {
      forceFormData: true,
      preserveScroll: true,
      onSuccess: () => {
        setAvatarPreview(null);
        setSaveProfileConfirmOpen(false);

        setData("user", {
          ...data.user,
          avatar: null,
          remove_avatar: false,
          current_password: "",
        });
      },
      onError: () => {
        setSaveProfileConfirmOpen(false);
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

  function confirmRemoveAvatar() {
    clearClientError("avatar");
    setAvatarPreview(null);

    setData("user", {
      ...data.user,
      avatar: null,
      remove_avatar: true,
    });

    setRemovePhotoConfirmOpen(false);
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
      <div className="mx-auto max-w-6xl space-y-6 sm:space-y-8">
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
          className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:gap-8"
        >
          <motion.main
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08 }}
            className="space-y-6 sm:space-y-8"
          >
            <ProfileInfoSection
              profile={profile}
              data={data}
              errors={errors}
              processing={processing}
              emailChanged={emailChanged}
              onFieldChange={updateField}
            />

            <ProfileOrganizationSection profile={profile} />
          </motion.main>

          <motion.aside
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
            className="space-y-6 xl:sticky xl:top-24 xl:self-start"
          >
            <ProfilePhotoActionsCard
              avatarUrl={avatarUrl}
              processing={processing}
              error={fieldError(errors, "avatar")}
              onAvatarChange={handleAvatarChange}
              onRemoveAvatar={() => setRemovePhotoConfirmOpen(true)}
            />

            <ProfileSaveCard
              processing={processing}
              emailChanged={emailChanged}
            />
          </motion.aside>
        </form>
      </div>

      <ConfirmDialog
        open={removePhotoConfirmOpen}
        title="Remove profile photo?"
        description="This will remove your current profile photo. You can upload a new one later."
        confirmText="Remove Photo"
        cancelText="Keep Photo"
        danger
        processing={processing}
        onCancel={() => setRemovePhotoConfirmOpen(false)}
        onConfirm={confirmRemoveAvatar}
      />

      <ConfirmDialog
        open={saveProfileConfirmOpen}
        title="Save profile changes?"
        description={
          emailChanged
            ? "Your profile will be updated and your new email will require confirmation before it becomes active."
            : "Your profile information will be updated for your current account."
        }
        confirmText="Save Profile"
        cancelText="Review Changes"
        processing={processing}
        onCancel={() => setSaveProfileConfirmOpen(false)}
        onConfirm={submitProfileUpdate}
      />

      <ConfirmDialog
        open={unsavedChangesGuard.confirmOpen}
        title={unsavedChangesGuard.title}
        description={unsavedChangesGuard.description}
        confirmText={unsavedChangesGuard.confirmText}
        cancelText={unsavedChangesGuard.cancelText}
        danger
        onCancel={unsavedChangesGuard.cancelNavigation}
        onConfirm={unsavedChangesGuard.confirmNavigation}
      />
    </AppLayout>
  );
}