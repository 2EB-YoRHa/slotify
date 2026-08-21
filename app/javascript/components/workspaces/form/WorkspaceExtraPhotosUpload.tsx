import { useEffect, useMemo, useState } from "react";
import {
  FileImage,
  ImagePlus,
  LockKeyhole,
  RotateCcw,
  Trash2,
  X,
} from "lucide-react";
import type { WorkspacePhotoItem } from "../../../types/workspace";
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
  existingPhotos?: WorkspacePhotoItem[];
  existingPhotoCount: number;
  removedPhotoIds: number[];
  disabled: boolean;
  error?: string | string[];
  onPhotosChange: (files: File[]) => void;
  onRemovedPhotoIdsChange: (ids: number[]) => void;
};

export default function WorkspaceExtraPhotosUpload({
  enabled,
  selectedFiles,
  existingPhotos = [],
  existingPhotoCount,
  removedPhotoIds,
  disabled,
  error,
  onPhotosChange,
  onRemovedPhotoIdsChange,
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

  const visibleExistingPhotos = existingPhotos.filter(
    (photo) => !removedPhotoIds.includes(photo.id),
  );

  const removedPhotos = existingPhotos.filter((photo) =>
    removedPhotoIds.includes(photo.id),
  );

  const visibleExistingCount =
    existingPhotos.length > 0 ? visibleExistingPhotos.length : existingPhotoCount;

  const totalSelectedCount = visibleExistingCount + selectedFiles.length;
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
    onPhotosChange(
      selectedFiles.filter((_file, fileIndex) => fileIndex !== index),
    );
    setClientError(null);
  }

  function clearSelectedPhotos() {
    onPhotosChange([]);
    setClientError(null);
    setInputKey((currentKey) => currentKey + 1);
  }

  function markExistingPhotoForRemoval(photoId: number) {
    onRemovedPhotoIdsChange([...new Set([...removedPhotoIds, photoId])]);
    setClientError(null);
  }

  function restoreExistingPhoto(photoId: number) {
    onRemovedPhotoIdsChange(removedPhotoIds.filter((id) => id !== photoId));
    setClientError(null);
  }

  function restoreAllRemovedPhotos() {
    onRemovedPhotoIdsChange([]);
    setClientError(null);
  }

  return (
    <div className="block min-w-0">
      <span className="mb-2 block text-sm font-bold text-slate-700 dark:text-slate-300">
        Extra Gallery Photos
      </span>

      <div
        className={`rounded-xl border border-dashed p-4 transition-colors sm:p-5 ${
          enabled
            ? "border-cyan-300 bg-cyan-50/20 dark:border-cyan-500/40 dark:bg-cyan-500/10"
            : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60"
        }`}
      >
        <div className="mb-5 flex items-start gap-3 sm:gap-4">
          <div
            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-sm transition-colors dark:bg-slate-900 dark:shadow-none sm:h-12 sm:w-12 ${
              enabled
                ? "text-cyan-500 dark:text-cyan-300"
                : "text-slate-400 dark:text-slate-500"
            }`}
          >
            {enabled ? (
              <FileImage size={22} strokeWidth={2.4} />
            ) : (
              <LockKeyhole size={22} strokeWidth={2.4} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-950 dark:text-slate-100">
              {enabled
                ? "Manage workspace gallery photos"
                : "Extra photos are available on Pro"}
            </p>

            <p className="mt-1 text-xs font-semibold leading-5 text-slate-400 dark:text-slate-500">
              {enabled
                ? `Add up to ${MAX_EXTRA_PHOTOS} extra photos. Removed saved photos are deleted after saving.`
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
          className="block w-full min-w-0 text-sm font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60 dark:text-slate-300 dark:file:bg-cyan-500/80 dark:hover:file:bg-cyan-300 dark:hover:file:text-slate-950"
        />

        {enabled && (
          <p className="mt-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
            {totalSelectedCount}/{MAX_EXTRA_PHOTOS} extra photos selected.
          </p>
        )}

        {visibleExistingPhotos.length > 0 && (
          <div className="mt-5 rounded-xl border border-slate-200 bg-white p-4 transition-colors dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-4 text-xs font-extrabold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Current saved extra photos
            </p>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {visibleExistingPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex h-24 items-center justify-center bg-slate-50 transition-colors dark:bg-slate-800 sm:h-28">
                    <img
                      src={photo.url}
                      alt={photo.filename}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => markExistingPhotoForRemoval(photo.id)}
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-red-500 opacity-100 shadow-sm transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-950/90 dark:text-red-300 dark:hover:bg-red-500/10 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label={`Remove ${photo.filename}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {removedPhotos.length > 0 && (
          <div className="mt-5 rounded-xl border border-red-100 bg-red-50 p-4 transition-colors dark:border-red-500/20 dark:bg-red-500/10">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-bold text-red-600 dark:text-red-300">
                  {removedPhotos.length} saved photo
                  {removedPhotos.length === 1 ? "" : "s"} marked for removal
                </p>

                <p className="mt-1 text-xs font-semibold leading-5 text-red-500 dark:text-red-300/80">
                  They will be deleted when you save changes.
                </p>
              </div>

              <button
                type="button"
                disabled={disabled}
                onClick={restoreAllRemovedPhotos}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-500 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-red-500/20 dark:bg-slate-900 dark:text-red-300 dark:hover:bg-red-500/10 sm:w-auto"
              >
                <RotateCcw size={14} />
                Restore all
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {removedPhotos.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  disabled={disabled}
                  onClick={() => restoreExistingPhoto(photo.id)}
                  className="inline-flex max-w-full items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-red-500 ring-1 ring-red-100 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-900 dark:text-red-300 dark:ring-red-500/20 dark:hover:bg-red-500/10"
                >
                  <RotateCcw size={13} className="shrink-0" />
                  <span className="truncate">{photo.filename}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {previews.length > 0 && (
          <div className="mt-5 rounded-xl border border-cyan-100 bg-white p-4 transition-colors dark:border-cyan-500/20 dark:bg-slate-900">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
              <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600 dark:text-cyan-300">
                New photos selected
              </p>

              <button
                type="button"
                disabled={disabled}
                onClick={clearSelectedPhotos}
                className="inline-flex w-full items-center justify-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-500 transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-red-500/10 dark:hover:text-red-300 sm:w-auto sm:border-0 sm:px-0 dark:sm:bg-transparent"
              >
                <X size={14} />
                Clear all
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {previews.map((preview, index) => (
                <div
                  key={`${preview.file.name}-${index}`}
                  className="group relative overflow-hidden rounded-xl border border-slate-200 bg-slate-50 transition-colors dark:border-slate-700 dark:bg-slate-800"
                >
                  <div className="flex h-24 items-center justify-center bg-slate-50 transition-colors dark:bg-slate-800 sm:h-28">
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
                    className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 text-slate-500 opacity-100 shadow-sm transition hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-slate-950/90 dark:text-slate-400 dark:hover:text-red-300 lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label={`Remove ${preview.file.name}`}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {enabled &&
          visibleExistingPhotos.length === 0 &&
          previews.length === 0 &&
          removedPhotos.length === 0 && (
            <div className="mt-5 flex h-28 flex-col items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-400 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-500">
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