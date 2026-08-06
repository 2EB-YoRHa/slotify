import { useState } from "react";
import { Camera, ImagePlus, LockKeyhole, Sparkles } from "lucide-react";
import type { Workspace, WorkspacePhotoItem } from "../../types/workspace";

type WorkspaceGalleryProps = {
  workspace: Workspace;
};

export default function WorkspaceGallery({ workspace }: WorkspaceGalleryProps) {
  const photos = galleryPhotosFor(workspace);
  const [selectedPhoto, setSelectedPhoto] = useState<WorkspacePhotoItem | null>(
    photos[0] || null,
  );

  if (photos.length === 0) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex h-80 flex-col items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
          <ImagePlus size={36} strokeWidth={2.4} />

          <p className="mt-4 text-sm font-bold">No workspace photos yet</p>

          <p className="mt-1 text-xs font-semibold">
            Add a main photo from the workspace form.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-6">
        <div>
          <div className="mb-2 flex items-center gap-2">
            <Camera size={18} className="text-cyan-500" strokeWidth={2.4} />

            <h2 className="text-lg font-extrabold text-slate-950">
              Workspace Gallery
            </h2>
          </div>

          <p className="text-sm leading-6 text-slate-500">
            {workspace.multiple_workspace_photos_enabled
              ? "Pro gallery is active for this workspace."
              : "Starter shows the main workspace photo. Extra gallery photos are available on Pro."}
          </p>
        </div>

        <span
          className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-extrabold uppercase tracking-wide ${
            workspace.multiple_workspace_photos_enabled
              ? "bg-cyan-50 text-cyan-600"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {workspace.multiple_workspace_photos_enabled ? (
            <Sparkles size={14} />
          ) : (
            <LockKeyhole size={14} />
          )}

          {workspace.multiple_workspace_photos_enabled
            ? `${photos.length} Photos`
            : "Starter Gallery"}
        </span>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
        <img
          src={selectedPhoto?.url}
          alt={selectedPhoto?.filename || workspace.name}
          className="h-96 w-full object-cover"
        />
      </div>

      {photos.length > 1 && (
        <div className="mt-4 grid grid-cols-6 gap-3">
          {photos.map((photo) => {
            const selected = selectedPhoto?.id === photo.id;

            return (
              <button
                key={photo.id}
                type="button"
                onClick={() => setSelectedPhoto(photo)}
                className={`overflow-hidden rounded-xl border bg-white p-1 transition ${
                  selected
                    ? "border-cyan-300 ring-4 ring-cyan-50"
                    : "border-slate-200 hover:border-cyan-200"
                }`}
              >
                <img
                  src={photo.url}
                  alt={photo.filename}
                  className="h-20 w-full rounded-lg object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function galleryPhotosFor(workspace: Workspace): WorkspacePhotoItem[] {
  if (workspace.gallery_photos && workspace.gallery_photos.length > 0) {
    return workspace.gallery_photos;
  }

  if (workspace.photo_url) {
    return [
      {
        id: workspace.id,
        url: workspace.photo_url,
        filename: workspace.photo_filename || workspace.name,
      },
    ];
  }

  return [];
}