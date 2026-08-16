import { useState } from "react";
import { FileImage, ImagePlus, X } from "lucide-react";
import { FormError } from "./WorkspaceFormFields";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  "image/png",
  "image/jpg",
  "image/jpeg",
  "image/webp",
];

type WorkspacePhotoUploadProps = {
  selectedFile: File | null;
  initialPreviewUrl?: string | null;
  currentFilename?: string | null;
  disabled: boolean;
  error?: string | string[];
  onPhotoChange: (file: File | null) => void;
};

export default function WorkspacePhotoUpload({
  selectedFile,
  initialPreviewUrl = null,
  currentFilename = null,
  disabled,
  error,
  onPhotoChange,
}: WorkspacePhotoUploadProps) {
  const [inputKey, setInputKey] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    initialPreviewUrl,
  );
  const [clientError, setClientError] = useState<string | null>(null);

  function handleFileChange(file: File | null) {
    revokeBlobPreview();

    if (!file) {
      resetToInitialPhoto();
      return;
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      onPhotoChange(null);
      setPreviewUrl(initialPreviewUrl);
      setClientError("The photo must be a PNG, JPG, JPEG, or WEBP image.");
      setInputKey((currentKey) => currentKey + 1);
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      onPhotoChange(null);
      setPreviewUrl(initialPreviewUrl);
      setClientError("The photo must be less than 5MB.");
      setInputKey((currentKey) => currentKey + 1);
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl(nextPreviewUrl);
    setClientError(null);
    onPhotoChange(file);
  }

  function clearSelectedPhoto() {
    revokeBlobPreview();
    resetToInitialPhoto();
    setInputKey((currentKey) => currentKey + 1);
  }

  function resetToInitialPhoto() {
    onPhotoChange(null);
    setPreviewUrl(initialPreviewUrl);
    setClientError(null);
  }

  function revokeBlobPreview() {
    if (previewUrl?.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }
  }

  const displayError = clientError || error;
  const hasCurrentPhoto = Boolean(initialPreviewUrl);
  const hasSelectedPhoto = Boolean(selectedFile);

  return (
    <div className="block min-w-0">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        Workspace Photo
      </span>

      <div className="rounded-xl border border-dashed border-cyan-300 bg-cyan-50/20 p-4 sm:p-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-[220px_minmax(0,1fr)]">
          <div className="self-start overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex h-44 w-full items-center justify-center bg-slate-50">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Workspace preview"
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-center text-slate-400">
                  <ImagePlus size={32} strokeWidth={2.4} />

                  <span className="mt-2 text-xs font-bold">
                    No photo selected
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex min-w-0 flex-col justify-center">
            <div className="mb-4 flex items-start gap-3 sm:gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white text-cyan-500 shadow-sm sm:h-12 sm:w-12">
                <FileImage size={22} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-950">
                  {hasSelectedPhoto
                    ? "New photo selected"
                    : hasCurrentPhoto
                      ? "Current workspace photo"
                      : "Upload workspace photo"}
                </p>

                <p className="mt-1 text-xs font-semibold leading-5 text-slate-400">
                  PNG, JPG, JPEG or WEBP. Maximum size: 5MB.
                </p>
              </div>
            </div>

            <input
              key={inputKey}
              type="file"
              accept="image/png,image/jpg,image/jpeg,image/webp"
              disabled={disabled}
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] || null)
              }
              className="block w-full min-w-0 text-sm font-medium text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-cyan-400 file:px-4 file:py-2 file:text-sm file:font-bold file:text-white hover:file:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-60"
            />

            {selectedFile && (
              <div className="mt-4 rounded-xl border border-cyan-100 bg-white p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-extrabold uppercase tracking-wide text-cyan-600">
                      Selected file
                    </p>

                    <p className="mt-1 truncate text-sm font-bold text-slate-950">
                      {selectedFile.name}
                    </p>

                    <p className="mt-1 text-xs font-semibold text-slate-400">
                      {formatFileSize(selectedFile.size)}
                    </p>
                  </div>

                  <button
                    type="button"
                    disabled={disabled}
                    onClick={clearSelectedPhoto}
                    className="shrink-0 rounded-lg border border-slate-200 bg-white p-2 text-slate-400 transition hover:bg-slate-50 hover:text-red-500 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}

            {!selectedFile && currentFilename && (
              <p className="mt-4 truncate text-xs font-bold text-slate-500">
                Current file: {currentFilename}
              </p>
            )}

            <FormError error={displayError} />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatFileSize(size: number): string {
  const sizeInMb = size / 1024 / 1024;

  return `${sizeInMb.toFixed(2)} MB`;
}