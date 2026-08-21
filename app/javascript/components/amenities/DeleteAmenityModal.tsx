import { router } from "@inertiajs/react";
import { useState } from "react";
import ConfirmDialog from "../ui/ConfirmDialog";
import type { Amenity } from "../../types/amenity";

type DeleteAmenityModalProps = {
  amenity: Amenity | null;
  onClose: () => void;
};

export default function DeleteAmenityModal({
  amenity,
  onClose,
}: DeleteAmenityModalProps) {
  const [processing, setProcessing] = useState(false);

  function confirmDelete() {
    if (!amenity) return;

    setProcessing(true);

    router.delete(`/amenities/${amenity.id}`, {
      onFinish: () => {
        setProcessing(false);
        onClose();
      },
    });
  }

  return (
    <ConfirmDialog
      open={Boolean(amenity)}
      title="Delete amenity?"
      description={`This will permanently delete ${
        amenity?.name || "this amenity"
      }. Workspaces using this amenity will no longer show it.`}
      confirmText="Delete Amenity"
      cancelText="Keep Amenity"
      danger
      processing={processing}
      onCancel={onClose}
      onConfirm={confirmDelete}
    />
  );
}