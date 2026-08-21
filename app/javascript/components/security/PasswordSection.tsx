import type { FormEvent } from "react";
import { LockKeyhole } from "lucide-react";
import PasswordChecklist from "../auth/PasswordChecklist";
import LoadingButton from "../ui/LoadingButton";
import type { PasswordFormData } from "../../types/security";
import { fieldError } from "../../utils/securityForm";
import { PasswordField, SectionHeader } from "./SecurityShared";

type PasswordSectionProps = {
  data: PasswordFormData;
  errors: Record<string, string | string[] | undefined>;
  processing: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (field: keyof PasswordFormData["user"], value: string) => void;
};

export default function PasswordSection({
  data,
  errors,
  processing,
  onSubmit,
  onFieldChange,
}: PasswordSectionProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6 lg:p-8">
      <SectionHeader
        title="Change password"
        description="Use a strong password with uppercase, lowercase, number, and symbol."
      />

      <form noValidate onSubmit={onSubmit} className="mt-6 space-y-6">
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          <PasswordField
            label="Current Password"
            value={data.user.current_password}
            placeholder="Current password"
            error={fieldError(errors, "current_password", "user")}
            disabled={processing}
            autoComplete="current-password"
            onChange={(value) => onFieldChange("current_password", value)}
          />

          <PasswordField
            label="New Password"
            value={data.user.password}
            placeholder="New password"
            error={fieldError(errors, "password", "user")}
            disabled={processing}
            autoComplete="new-password"
            onChange={(value) => onFieldChange("password", value)}
          />

          <PasswordField
            label="Confirm Password"
            value={data.user.password_confirmation}
            placeholder="Confirm password"
            error={fieldError(errors, "password_confirmation", "user")}
            disabled={processing}
            autoComplete="new-password"
            onChange={(value) =>
              onFieldChange("password_confirmation", value)
            }
          />
        </div>

        <PasswordChecklist
          password={data.user.password}
          passwordConfirmation={data.user.password_confirmation}
        />

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-6 transition-colors dark:border-slate-800 sm:flex-row sm:items-center">
          <LoadingButton
            type="submit"
            loading={processing}
            loadingText="Updating..."
            className="w-full sm:w-auto sm:min-w-44"
          >
            <LockKeyhole size={17} />
            Update Password
          </LoadingButton>

          <p className="text-xs font-semibold leading-5 text-slate-400 dark:text-slate-500">
            You will stay signed in after the password is updated.
          </p>
        </div>
      </form>
    </section>
  );
}