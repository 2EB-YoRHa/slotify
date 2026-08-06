import { useEffect, useMemo, useState } from "react";
import { FileImage, ImagePlus, LockKeyhole, X } from "lucide-react";
import { FormError } from "./WorkspaceFormFields";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_EXTRA_PHOTOS = 5;

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

type WorkspaceExtraPhotosUploadProps = {
  enabled: boolean;
  selectedFiles: File[];
  existingPhotoCount: number;
  disabled: boolean;
  error?: string | string[];
  onPhotosChange: (files: File[]) => void;
};

export default function WorkspaceExtraPhotosUpload({
  enabled,
  selectedFiles,
  existingPhotoCount,
  disabled,
  error,
  onPhotosChange,
}: WorkspaceExtraPhotosUploadProps) {
  const [inputKey, setInputKey] = useState(0);
  const [clientError, setClientError] = useState<string | null>(null);

  const previews = useMemo(
    () =>
      selectedFiles.map((file) => ({
        file,
        url: URL.createObjectURL(file),
      })),
    [selectedFiles],
  );

  useEffect(() => {
    return () => {
      previews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [previews]);

  const totalSelectedCount = existingPhotoCount + selectedFiles.length;
  const availableSlots = Math.max(MAX_EXTRA_PHOTOS - totalSelectedCount, 0);
  const displayError = clientError || error;

  function handleFileChange(files: FileList | null) {
    if (!enabled || disabled) return;

    const incomingFiles = Array.from(files || []);

    if (incomingFiles.length === 0) return;

    const validFiles: File[] = [];

    for (const file of incomingFiles) {
      if (!ALLOWED_FILE_TYPES.includes(file.type)) {
        setClientError("Extra photos must be PNG, JPG, JPEG, or WEBP images.");
        setInputKey((currentKey) => currentKey + 1);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setClientError("Each extra photo must be less than 5MB.");
        setInputKey((currentKey) => currentKey + 1);
        return;
      }

      validFiles.push(file);
    }

    if (availableSlots <= 0) {
      setClientError(`You can attach up to ${MAX_EXTRA_PHOTOS} extra photos.`);
      setInputKey((currentKey) => currentKey + 1);
      return;
    }

    const filesToAdd = validFiles.slice(0, availableSlots);
    const nextFiles = [...selectedFiles, ...filesToAdd];

    onPhotosChange(nextFiles);
    setClientError(
      validFiles.length > filesToAdd.length
        ? `Only ${availableSlots} more photo${
            availableSlots === 1 ? "" : "s"
          } can be added. The limit is ${MAX_EXTRA_PHOTOS}.`
        : null,
    );
    setInputKey((currentKey) => currentKey + 1);
  }

  function removeSelectedPhoto(index: number) {
    onPhotosChange(selectedFiles.filter((_file, fileIndex) => fileIndex !== index));
    setClientError(null);
  }

  function clearSelectedPhotos() {
    onPhotosChange([]);
    setClientError(null);
    setInputKey((currentKey) => currentKey + 1);
  }

  return (
    <div className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        Extra Gallery Photos
      </span>

      <div
        className={`rounded-xl border border-dashed p-5 ${
          enabled
            ? "border-cyan-300 bg-cyan-50/20"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <div className="mb-5 flex items-start gap-4">
          <div
            className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm ${
              enabled ? "text-cyan-500" : "text-slate-400"
            }`}
          >
            {enabled ? (
              <FileImage size={22} strokeWidth={2.4} />
            ) : (
              <LockKeyhole size={22} strokeWidth={2.4} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-950">
              {enabled
                ? "Add workspace gallery photos"
                : "Extra photos are available on Pro"}
            </p>

            <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
              {enabled
                ? `Add up to ${MAX_EXTRA_PHOTOS} extra photos. You can select more than once before saving.`
                : "Starter keeps one main photo per workspace."}
            </p>
          </div>
        </div>

        <input
          key={inputKey}
          type="file"
          multiple
          accept="image/png,image/jpg,image/jpeg,image/webp"
          disabled={disabled || !enabled || availableSlots <= 0}
          onChange={(event) => handleFileChange(event.target.files)}
          className="block w-full text-sm font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
        />

        {enabled && (
          <p className="mt-3 text-xs font-semibold text-slate-500">
            {totalSelectedCount}/{MAX_EXTRA_PHOTOS} extra photos selected.
          </p>
        )}

        {previews.length > 0 && (
          <div className="mt-5 rounded-xl border border-cyan-100 bg-white p-4">
            <div className="mb-4 flex items-center justify-between gap-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                New photos selected
              </p>

              <button
                type="button"
                disabled={disabled}
                onClick={clearSelectedPhotos}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <X size={14} />
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-5 gap-3">
              {previews.map((preview, index) => (
                <div
                  key={`${preview.file.name}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50"
                >
                  <div className="flex h-28 items-center justify-center bg-slate-50">
                    <img
                      src={preview.url}
                      alt={preview.file.name}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeSelectedPhoto(index)}
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-slate-500 opacity-0 shadow-sm transition hover:text-red-500 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                    aria-label={`Remove ${preview.file.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {enabled && previews.length === 0 && (
          <div className="mt-5 flex h-28 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400">
            <ImagePlus size={28} strokeWidth={2.4} />

            <span className="mt-2 text-xs font-bold">
              No extra photos selected
            </span>
          </div>
        )}

        <FormError error={displayError} />
      </div>
    </div>
  );
}