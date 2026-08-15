import type { FormEvent } from "react";
import { ShieldCheck, XCircle } from "lucide-react";
import LoadingButton from "../ui/LoadingButton";
import type { TwoFactorFormData, TwoFactorSettings } from "../../types/security";
import { fieldError } from "../../utils/securityForm";
import {
  CodeField,
  InlineNote,
  PasswordField,
  SectionHeader,
} from "./SecurityShared";
import TwoFactorSetupPanel from "./TwoFactorSetupPanel";
import TwoFactorStatus from "./TwoFactorStatus";

type TwoFactorSectionProps = {
  twoFactor: TwoFactorSettings;
  data: TwoFactorFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  copied: boolean;
  onCopySetupKey: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (
    field: keyof TwoFactorFormData["two_factor"],
    value: string,
  ) => void;
};

export default function TwoFactorSection({
  twoFactor,
  data,
  errors,
  processing,
  copied,
  onCopySetupKey,
  onSubmit,
  onFieldChange,
}: TwoFactorSectionProps) {
  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-100 p-5 sm:p-6 lg:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <SectionHeader
            title={
              twoFactor.enabled
                ? "Your account is protected"
                : "Add authenticator protection"
            }
            description={
              twoFactor.enabled
                ? "Slotify will ask for a 6-digit code after your password when you sign in."
                : "Use a 6-digit code from an authenticator app instead of waiting for email."
            }
          />

          <TwoFactorStatus enabled={twoFactor.enabled} />
        </div>
      </div>

      {!twoFactor.enabled && (
        <div className="border-b border-slate-100 bg-cyan-50 p-5 sm:p-6 lg:p-8">
          <TwoFactorSetupPanel
            twoFactor={twoFactor}
            copied={copied}
            onCopySetupKey={onCopySetupKey}
          />
        </div>
      )}

      {twoFactor.enabled && (
        <div className="border-b border-slate-100 bg-green-50 px-5 py-5 sm:px-6 lg:px-8">
          <InlineNote
            tone="green"
            text="Two-factor authentication is enabled. Your next login will require your password and an authenticator code."
          />
        </div>
      )}

      <form noValidate onSubmit={onSubmit} className="p-5 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <CodeField
            value={data.two_factor.code}
            error={fieldError(errors, "code", "two_factor")}
            disabled={processing}
            onChange={(value) =>
              onFieldChange("code", value.replace(/\D/g, "").slice(0, 6))
            }
          />

          <PasswordField
            label="Current Password"
            value={data.two_factor.current_password}
            placeholder="Current password"
            error={fieldError(errors, "current_password", "two_factor")}
            disabled={processing}
            autoComplete="current-password"
            onChange={(value) => onFieldChange("current_password", value)}
          />
        </div>

        <div className="mt-5">
          <InlineNote
            tone="amber"
            text="Keep access to your authenticator app. Without it, you may need admin help to recover your account."
          />
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
          <LoadingButton
            type="submit"
            loading={processing}
            loadingText={twoFactor.enabled ? "Disabling..." : "Enabling..."}
            variant={twoFactor.enabled ? "danger" : "primary"}
            className="w-full sm:w-auto sm:min-w-44"
          >
            {twoFactor.enabled ? (
              <>
                <XCircle size={17} />
                Disable 2FA
              </>
            ) : (
              <>
                <ShieldCheck size={17} />
                Enable 2FA
              </>
            )}
          </LoadingButton>

          <p className="text-xs font-semibold leading-5 text-slate-400">
            {twoFactor.enabled
              ? "A valid code is required before this protection can be disabled."
              : "The authenticator code refreshes every 30 seconds."}
          </p>
        </div>
      </form>
    </section>
  );
}