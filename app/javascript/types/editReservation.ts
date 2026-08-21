import type { BookingTimeSlot } from "./bookingTimeSlot";
import type { Reservation } from "./reservation";
import type { Workspace } from "./workspace";

export type EditReservationFormProps = {
  reservation: Reservation;
  workspaces: Workspace[];
  errors?: Partial<Record<string, string | string[]>>;
  maxReservationHours?: number | null;
  minNoticeMinutes?: number | null;
  allowWeekendBookings?: boolean | null;
  bookingTimeSlots?: BookingTimeSlot[];
  canManageStatus?: boolean;
  initialUnavailableWorkspaceIds?: number[];
};

export type EditReservationFormData = {
  workspace_id: number | string;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count: number | string;
  notes: string;
};