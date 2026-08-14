import { motion } from "motion/react";
import useNewReservationForm from "../../hooks/useNewReservationForm";
import type { NewReservationFormProps } from "../../types/newReservation";
import ConfirmDialog from "../ui/ConfirmDialog";
import AvailableWorkspaceGrid from "./new/AvailableWorkspaceGrid";
import ReservationDateTimeSection from "./new/ReservationDateTimeSection";
import ReservationSummaryPanel from "./new/ReservationSummaryPanel";

export default function NewReservationForm(props: NewReservationFormProps) {
  const reservationForm = useNewReservationForm(props);

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
          <ReservationDateTimeSection
            selectedDate={reservationForm.selectedDate}
            selectedSlot={reservationForm.selectedSlot}
            timeSlots={reservationForm.timeSlots}
            search={reservationForm.search}
            processing={reservationForm.processing}
            checkingAvailability={reservationForm.checkingAvailability}
            availabilityChecked={reservationForm.availabilityChecked}
            availabilityError={reservationForm.availabilityError}
            unavailableCount={reservationForm.unavailableWorkspaceIds.length}
            minNoticeViolation={reservationForm.minNoticeViolation}
            minNoticeMinutes={props.minNoticeMinutes || 0}
            weekendViolation={reservationForm.weekendViolation}
            baseErrors={reservationForm.baseErrors}
            minDate={reservationForm.today}
            selectedWorkspaceName={reservationForm.selectedWorkspace?.name || null}
            workspacePickerVisible={reservationForm.showWorkspacePicker}
            onDateChange={reservationForm.handleDateChange}
            onSlotChange={reservationForm.handleSlotChange}
            onSearchChange={reservationForm.setSearch}
            onRefreshAvailability={() => void reservationForm.checkAvailability()}
            onToggleWorkspacePicker={reservationForm.toggleWorkspacePicker}
          />

          {(reservationForm.showWorkspacePicker ||
            !reservationForm.selectedWorkspace) && (
            <AvailableWorkspaceGrid
              workspaces={props.workspaces}
              filteredWorkspaces={reservationForm.filteredWorkspaces}
              selectedWorkspaceId={reservationForm.data.reservation.workspace_id}
              unavailableWorkspaceIds={reservationForm.unavailableWorkspaceIds}
              availabilityChecked={reservationForm.availabilityChecked}
              processing={reservationForm.processing}
              onSelectWorkspace={reservationForm.selectWorkspace}
            />
          )}
        </motion.section>

        <motion.aside
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.16 }}
          className="space-y-6"
        >
          <ReservationSummaryPanel
            selectedWorkspace={reservationForm.selectedWorkspace}
            selectedDate={reservationForm.selectedDate}
            selectedSlotLabel={reservationForm.selectedSlot.label}
            attendeesCount={reservationForm.data.reservation.attendees_count}
            notes={reservationForm.data.reservation.notes}
            errors={reservationForm.allErrors}
            estimatedTotal={reservationForm.estimatedTotal}
            availabilityChecked={reservationForm.availabilityChecked}
            ruleViolation={reservationForm.ruleViolation}
            selectedWorkspaceUnavailable={
              reservationForm.selectedWorkspaceUnavailable
            }
            attendeesExceedCapacity={reservationForm.attendeesExceedCapacity}
            minNoticeViolation={reservationForm.minNoticeViolation}
            minNoticeMinutes={props.minNoticeMinutes || 0}
            weekendViolation={reservationForm.weekendViolation}
            processing={reservationForm.processing}
            canSubmit={reservationForm.canSubmit}
            onAttendeesChange={(value) =>
              reservationForm.updateReservation({ attendees_count: value })
            }
            onNotesChange={(value) =>
              reservationForm.updateReservation({ notes: value })
            }
            onCancel={() =>
              reservationForm.unsavedChangesGuard.guardedVisit(
                reservationForm.cancelHref,
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