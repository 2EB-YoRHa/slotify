import { useEffect, useMemo, useState } from "react";
import { Building2 } from "lucide-react";
import type { WorkspacePhotoItem } from "../../types/workspace";

type WorkspacePhotoFit = "cover" | "contain" | "fill";

type WorkspacePhotoProps = {
  name: string;
  photoUrl?: string | null;
  galleryPhotos?: WorkspacePhotoItem[];
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  fit?: WorkspacePhotoFit;
  position?: string;
  showThumbnails?: boolean;
};

export default function WorkspacePhoto({
  name,
  photoUrl,
  galleryPhotos = [],
  className = "",
  imageClassName = "",
  fallbackClassName = "",
  fit = "contain",
  position = "object-center",
  showThumbnails = false,
}: WorkspacePhotoProps) {
  const photos = useMemo(
    () => normalizedPhotos(name, photoUrl, galleryPhotos),
    [galleryPhotos, name, photoUrl],
  );

  const [selectedPhotoId, setSelectedPhotoId] = useState<number | null>(
    photos[0]?.id || null,
  );

  useEffect(() => {
    setSelectedPhotoId(photos[0]?.id || null);
  }, [photos]);

  const selectedPhoto =
    photos.find((photo) => photo.id === selectedPhotoId) || photos[0];

  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[fit];

  const shouldShowBlurredBackground = selectedPhoto?.url && fit === "contain";

  return (
    <div className="space-y-3">
      <div
        className={`relative flex items-center justify-center overflow-hidden bg-slate-100 transition-colors dark:bg-slate-800 ${className}`}
      >
        {selectedPhoto?.url ? (
          <>
            {shouldShowBlurredBackground && (
              <img
                src={selectedPhoto.url}
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-xl dark:opacity-25"
              />
            )}

            <img
              src={selectedPhoto.url}
              alt={selectedPhoto.filename || name}
              className={`relative z-10 h-full w-full ${fitClass} ${position} ${imageClassName}`}
            />
          </>
        ) : (
          <div
            className={`flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-50 to-slate-100 text-cyan-500 transition-colors dark:from-cyan-500/10 dark:to-slate-800 dark:text-cyan-300 ${fallbackClassName}`}
          >
            <Building2 size={32} strokeWidth={2.4} />
          </div>
        )}
      </div>

      {showThumbnails && photos.length > 1 && (
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 sm:gap-3">
          {photos.map((photo) => {
            const selected = photo.id === selectedPhoto?.id;

            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhotoId(photo.id)}
                className={`overflow-hidden rounded-xl border bg-white p-1 transition dark:bg-slate-900 ${
                  selected
                    ? "border-cyan-300 ring-4 ring-cyan-50 dark:border-cyan-400 dark:ring-cyan-500/20"
                    : "border-slate-200 hover:border-cyan-200 dark:border-slate-700 dark:hover:border-cyan-500/40"
                }`}
              >
                <div className="flex h-16 items-center justify-center rounded-lg bg-slate-50 transition-colors dark:bg-slate-800 sm:h-20">
                  <img
                    src={photo.url}
                    alt={photo.filename || name}
                    className="h-full w-full object-contain"
                  />
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function normalizedPhotos(
  name: string,
  photoUrl?: string | null,
  galleryPhotos: WorkspacePhotoItem[] = [],
): WorkspacePhotoItem[] {
  if (galleryPhotos.length > 0) return galleryPhotos;

  if (!photoUrl) return [];

  return [
    {
      id: -1,
      url: photoUrl,
      filename: name,
    },
  ];
}