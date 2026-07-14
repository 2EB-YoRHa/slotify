export type ReservationWorkspace = {
  id: number;
  name?: string | null;
  workspace_type?: string | null;
  capacity?: number | null;
  location?: string | null;
};

export type ReservationUser = {
  id: number;
  name?: string | null;
  email?: string | null;
};

export type Reservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  attendees_count?: number | null;
  notes?: string | null;
  total_price?: number | string | null;
  workspace?: ReservationWorkspace | null;
  user?: ReservationUser | null;
};