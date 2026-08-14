import { motion } from "motion/react";
import useEditReservationForm from "../../hooks/useEditReservationForm";
import type { EditReservationFormProps } from "../../types/editReservation";
import ConfirmDialog from "../ui/ConfirmDialog";
import EditReservationDetailsSection from "./edit/EditReservationDetailsSection";
import EditReservationScheduleSection from "./edit/EditReservationScheduleSection";
import EditReservationSummaryPanel from "./edit/EditReservationSummaryPanel";

export default function EditReservationForm(props: EditReservationFormProps) {
  const reservationForm = useEditReservationForm(props);
  const { reservation, workspaces } = props;

  return (
    <>
      <form
        noValidate
        onSubmit={reservationForm.handleSubmit}
        className="grid grid-cols-3 gap-8"
      >
        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="col-span-2 space-y-8"
        >
          <EditReservationScheduleSection
            workspaces={workspaces}
            data={reservationForm.data}
            errors={reservationForm.errors}
            processing={reservationForm.processing}
            selectedSlot={reservationForm.selectedSlot}
            timeSlots={reservationForm.timeSlots}
            canManageStatus={reservationForm.canManageStatus}
            hasCustomSlots={reservationForm.hasCustomSlots}
            noCustomSlotsForSelectedDate={
              reservationForm.noCustomSlotsForSelectedDate
            }
            customTimeSlotViolation={reservationForm.customTimeSlotViolation}
            onWorkspaceChange={(value) =>
              reservationForm.updateField("workspace_id", value)
            }
            onStatusChange={(value) =>
              reservationForm.updateField("status", value)
            }
            onDateChange={reservationForm.handleDateChange}
            onSlotChange={reservationForm.handleSlotChange}
          />

          <EditReservationDetailsSection
            data={reservationForm.data}
            errors={reservationForm.errors}
            processing={reservationForm.processing}
            selectedWorkspace={reservationForm.selectedWorkspace}
            attendeesExceedCapacity={reservationForm.attendeesExceedCapacity}
            onAttendeesChange={(value) =>
              reservationForm.updateField("attendees_count", value)
            }
            onNotesChange={(value) =>
              reservationForm.updateField("notes", value)
            }
          />
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <EditReservationSummaryPanel
            reservationId={reservation.id}
            selectedWorkspace={reservationForm.selectedWorkspace}
            startTime={reservationForm.data.start_time}
            selectedSlotLabel={reservationForm.selectedSlot.label}
            status={reservationForm.data.status}
            attendeesCount={reservationForm.data.attendees_count}
            ruleViolation={reservationForm.ruleViolation}
            checkingAvailability={reservationForm.checkingAvailability}
            availabilityChecked={reservationForm.availabilityChecked}
            availabilityError={reservationForm.availabilityError}
            selectedWorkspaceUnavailable={
              reservationForm.selectedWorkspaceUnavailable
            }
            attendeesExceedCapacity={reservationForm.attendeesExceedCapacity}
            minNoticeViolation={reservationForm.minNoticeViolation}
            minNoticeMinutes={reservationForm.minNoticeMinutes || 0}
            weekendViolation={reservationForm.weekendViolation}
            noCustomSlotsForSelectedDate={
              reservationForm.noCustomSlotsForSelectedDate
            }
            customTimeSlotViolation={reservationForm.customTimeSlotViolation}
            processing={reservationForm.processing}
            canSubmit={reservationForm.canSubmit}
            onCancel={() =>
              reservationForm.unsavedChangesGuard.guardedVisit(
                `/reservations/${reservation.id}`,
              )
            }
          />
        </motion.aside>
      </form>

      <ConfirmDialog
        open={reservationForm.unsavedChangesGuard.confirmOpen}
        title={reservationForm.unsavedChangesGuard.title}
        description={reservationForm.unsavedChangesGuard.description}
        confirmText={reservationForm.unsavedChangesGuard.confirmText}
        cancelText={reservationForm.unsavedChangesGuard.cancelText}
        danger
        onCancel={reservationForm.unsavedChangesGuard.cancelNavigation}
        onConfirm={reservationForm.unsavedChangesGuard.confirmNavigation}
      />
    </>
  );
}