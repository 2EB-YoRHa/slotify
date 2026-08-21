import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Building2, ChevronLeft, ChevronRight } from "lucide-react";
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
  showControls?: boolean;
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
  showControls = false,
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

  const selectedIndex = Math.max(
    0,
    photos.findIndex((photo) => photo.id === selectedPhoto?.id),
  );

  const multiplePhotos = photos.length > 1;
  const canNavigate = showControls && multiplePhotos;

  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[fit];

  const shouldShowBlurredBackground = selectedPhoto?.url && fit === "contain";

  function selectPreviousPhoto() {
    if (!canNavigate) return;

    const nextIndex = selectedIndex === 0 ? photos.length - 1 : selectedIndex - 1;
    setSelectedPhotoId(photos[nextIndex].id);
  }

  function selectNextPhoto() {
    if (!canNavigate) return;

    const nextIndex = selectedIndex === photos.length - 1 ? 0 : selectedIndex + 1;
    setSelectedPhotoId(photos[nextIndex].id);
  }

  return (
    <div className="space-y-3">
      <div
        className={`group relative flex items-center justify-center overflow-hidden bg-slate-100 transition-colors dark:bg-slate-800 ${className}`}
      >
        {selectedPhoto?.url ? (
          <>
            <AnimatePresence mode="wait">
              {shouldShowBlurredBackground && (
                <motion.img
                  key={`background-${selectedPhoto.id}`}
                  src={selectedPhoto.url}
                  alt=""
                  aria-hidden="true"
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 0.22, scale: 1.12 }}
                  exit={{ opacity: 0, scale: 1.08 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="absolute inset-0 h-full w-full object-cover blur-xl dark:opacity-25"
                />
              )}
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.img
                key={`photo-${selectedPhoto.id}`}
                src={selectedPhoto.url}
                alt={selectedPhoto.filename || name}
                initial={{ opacity: 0, scale: 0.985 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.015 }}
                transition={{ duration: 0.28, ease: "easeOut" }}
                className={`relative z-10 h-full w-full ${fitClass} ${position} ${imageClassName}`}
              />
            </AnimatePresence>

            {canNavigate && (
              <>
                <CarouselButton
                  label="Previous workspace photo"
                  direction="left"
                  onClick={selectPreviousPhoto}
                />

                <CarouselButton
                  label="Next workspace photo"
                  direction="right"
                  onClick={selectNextPhoto}
                />
              </>
            )}
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
                className={`overflow-hidden rounded-xl border bg-white p-1 transition hover:-translate-y-0.5 dark:bg-slate-900 ${
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

type CarouselButtonProps = {
  label: string;
  direction: "left" | "right";
  onClick: () => void;
};

function CarouselButton({ label, direction, onClick }: CarouselButtonProps) {
  const Icon = direction === "left" ? ChevronLeft : ChevronRight;
  const positionClass = direction === "left" ? "left-3" : "right-3";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={`absolute top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/60 bg-slate-950/55 text-white shadow-lg shadow-slate-950/20 backdrop-blur-md transition hover:scale-105 hover:bg-cyan-400 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-cyan-300/30 dark:border-white/10 dark:bg-slate-950/70 dark:hover:bg-cyan-300 ${positionClass} sm:h-12 sm:w-12`}
    >
      <Icon size={22} strokeWidth={2.6} />
    </button>
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