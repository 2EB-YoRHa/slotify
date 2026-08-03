import { Building2 } from "lucide-react";

type WorkspacePhotoFit = "cover" | "contain" | "fill";

type WorkspacePhotoProps = {
  name: string;
  photoUrl?: string | null;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
  fit?: WorkspacePhotoFit;
  position?: string;
};

export default function WorkspacePhoto({
  name,
  photoUrl,
  className = "",
  imageClassName = "",
  fallbackClassName = "",
  fit = "contain",
  position = "object-center",
}: WorkspacePhotoProps) {
  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[fit];

  const shouldShowBlurredBackground = photoUrl && fit === "contain";

  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-slate-100 ${className}`}
    >
      {photoUrl ? (
        <>
          {shouldShowBlurredBackground && (
            <img
              src={photoUrl}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-20 blur-xl"
            />
          )}

          <img
            src={photoUrl}
            alt={name}
            className={`relative z-10 h-full w-full ${fitClass} ${position} ${imageClassName}`}
          />
        </>
      ) : (
        <div
          className={`flex h-full w-full items-center justify-center bg-linear-to-br from-cyan-50 to-slate-100 text-cyan-500 ${fallbackClassName}`}
        >
          <Building2 size={32} strokeWidth={2.4} />
        </div>
      )}
    </div>
  );
}