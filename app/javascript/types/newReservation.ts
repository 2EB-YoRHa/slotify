import type { BookingTimeSlot } from "./bookingTimeSlot";
import type { Workspace } from "./workspace";

export type NewReservationFormProps = {
  workspaces: Workspace[];
  selectedWorkspaceId?: number | string | null;
  initialStartTime?: string | null;
  initialEndTime?: string | null;
  initialUnavailableWorkspaceIds?: number[];
  initialErrors?: Record<string, string | string[]>;
  maxReservationHours?: number | null;
  minNoticeMinutes?: number | null;
  allowWeekendBookings?: boolean | null;
  bookingTimeSlots?: BookingTimeSlot[];
};

export type ReservationFormData = {
  reservation: {
    workspace_id: number | string;
    start_time: string;
    end_time: string;
    attendees_count: number | string;
    notes: string;
  };
};