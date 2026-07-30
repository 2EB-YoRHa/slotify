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
  fit = "cover",
  position = "object-center",
}: WorkspacePhotoProps) {
  const fitClass = {
    cover: "object-cover",
    contain: "object-contain",
    fill: "object-fill",
  }[fit];

  return (
    <div
      className={`overflow-hidden bg-linear-to-br from-slate-100 to-slate-200 ${className}`}
    >
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={name}
          className={`h-full w-full ${fitClass} ${position} ${imageClassName}`}
        />
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