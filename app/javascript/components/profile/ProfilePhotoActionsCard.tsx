import type { ChangeEvent } from "react";
import { Camera, Trash2, UploadCloud } from "lucide-react";
import { FieldError, FieldHint } from "../ui/FormFeedback";

type ProfilePhotoActionsCardProps = {
  avatarUrl?: string | null;
  processing: boolean;
  error?: string | string[];
  onAvatarChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onRemoveAvatar: () => void;
};

export default function ProfilePhotoActionsCard({
  avatarUrl,
  processing,
  error,
  onAvatarChange,
  onRemoveAvatar,
}: ProfilePhotoActionsCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition-colors dark:border-slate-800 dark:bg-slate-900 dark:shadow-slate-950/30 sm:p-6">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-500 transition-colors dark:bg-cyan-500/10 dark:text-cyan-300">
          <Camera size={19} strokeWidth={2.4} />
        </div>

        <div className="min-w-0">
          <h2 className="text-lg font-black text-slate-950 dark:text-slate-100">
            Photo
          </h2>

          <p className="text-sm font-semibold leading-6 text-slate-500 dark:text-slate-400">
            PNG, JPG, JPEG or WEBP.
          </p>
        </div>
      </div>

      <label className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-black text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
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
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-red-100 bg-white px-5 py-3 text-sm font-black text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10"
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