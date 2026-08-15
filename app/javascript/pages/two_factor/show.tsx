import { useForm } from "@inertiajs/react";
import { useState } from "react";
import type { FormEvent } from "react";
import AppLayout from "../../components/AppLayout";
import AccountSettingsNav from "../../components/account/AccountSettingsNav";
import PasswordSection from "../../components/security/PasswordSection";
import { SecurityHero } from "../../components/security/SecurityShared";
import TwoFactorSection from "../../components/security/TwoFactorSection";
import type {
  PasswordFormData,
  TwoFactorFormData,
  TwoFactorSettings,
} from "../../types/security";
import {
  hasValidationErrors,
  type ValidationErrors,
} from "../../utils/clientValidation";
import {
  validatePasswordForm,
  validateTwoFactorForm,
} from "../../utils/securityForm";

type SecurityShowProps = {
  two_factor: TwoFactorSettings;
  two_factor_errors?: Partial<Record<string, string | string[]>>;
  password_errors?: Partial<Record<string, string | string[]>>;
  errors?: Partial<Record<string, string | string[]>>;
};

export default function SecurityShow({
  two_factor,
  two_factor_errors = {},
  password_errors = {},
  errors = {},
}: SecurityShowProps) {
  const [passwordClientErrors, setPasswordClientErrors] =
    useState<ValidationErrors>({});
  const [twoFactorClientErrors, setTwoFactorClientErrors] =
    useState<ValidationErrors>({});
  const [copied, setCopied] = useState(false);

  const passwordForm = useForm<PasswordFormData>({
    user: {
      current_password: "",
      password: "",
      password_confirmation: "",
    },
  });

  const twoFactorForm = useForm<TwoFactorFormData>({
    two_factor: {
      code: "",
      current_password: "",
    },
  });

  const passwordErrors: Record<string, string | string[] | undefined> = {
    ...password_errors,
    ...passwordForm.errors,
    ...passwordClientErrors,
  };

  const twoFactorErrors: Record<string, string | string[] | undefined> = {
    ...errors,
    ...two_factor_errors,
    ...twoFactorForm.errors,
    ...twoFactorClientErrors,
  };

  async function copySetupKey() {
    if (!two_factor.setup_key) return;

    await navigator.clipboard.writeText(two_factor.setup_key);

    setCopied(true);

    window.setTimeout(() => {
      setCopied(false);
    }, 1800);
  }

  function handlePasswordSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validatePasswordForm(passwordForm.data);
    setPasswordClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    passwordForm.patch("/password_settings", {
      preserveScroll: true,
      onSuccess: () => passwordForm.reset(),
    });
  }

  function handleTwoFactorSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const validationErrors = validateTwoFactorForm(twoFactorForm.data);
    setTwoFactorClientErrors(validationErrors);

    if (hasValidationErrors(validationErrors)) return;

    if (two_factor.enabled) {
      twoFactorForm.delete("/two_factor", {
        preserveScroll: true,
        onSuccess: () => twoFactorForm.reset(),
      });
    } else {
      twoFactorForm.patch("/two_factor/enable", {
        preserveScroll: true,
        onSuccess: () => twoFactorForm.reset(),
      });
    }
  }

  function updatePasswordField(
    field: keyof PasswordFormData["user"],
    value: string,
  ) {
    setPasswordClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`user.${field}`];

      return nextErrors;
    });

    passwordForm.setData("user", {
      ...passwordForm.data.user,
      [field]: value,
    });
  }

  function updateTwoFactorField(
    field: keyof TwoFactorFormData["two_factor"],
    value: string,
  ) {
    setTwoFactorClientErrors((currentErrors) => {
      const nextErrors = { ...currentErrors };

      delete nextErrors[field];
      delete nextErrors[`two_factor.${field}`];

      return nextErrors;
    });

    twoFactorForm.setData("two_factor", {
      ...twoFactorForm.data.two_factor,
      [field]: value,
    });
  }

  return (
    <AppLayout>
      <div className="mx-auto max-w-5xl space-y-6 sm:space-y-8">
        <SecurityHero />

        <AccountSettingsNav active="security" />

        <main className="space-y-6 sm:space-y-8">
          <PasswordSection
            data={passwordForm.data}
            errors={passwordErrors}
            processing={passwordForm.processing}
            onSubmit={handlePasswordSubmit}
            onFieldChange={updatePasswordField}
          />

          <TwoFactorSection
            twoFactor={two_factor}
            data={twoFactorForm.data}
            errors={twoFactorErrors}
            processing={twoFactorForm.processing}
            copied={copied}
            onCopySetupKey={copySetupKey}
            onSubmit={handleTwoFactorSubmit}
            onFieldChange={updateTwoFactorField}
          />
        </main>
      </div>
    </AppLayout>
  );
}