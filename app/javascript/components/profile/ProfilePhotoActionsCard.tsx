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