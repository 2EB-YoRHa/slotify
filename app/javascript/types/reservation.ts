import type { Amenity } from "./amenity";

export type ReservationWorkspace = {
  id: number;
  name?: string | null;
  workspace_type?: string | null;
  capacity?: number | null;
  location?: string | null;
  floor?: string | null;
  zone?: string | null;
  hourly_rate?: string | number | null;
  amenities?: Amenity[];
  photo_attached?: boolean;
  photo_url?: string | null;
  photo_filename?: string | null;
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