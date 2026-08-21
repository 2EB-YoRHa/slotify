import type { Amenity } from "./amenity";
import type { WorkspacePhotoItem } from "./workspace";

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
  extra_photos?: WorkspacePhotoItem[];
  gallery_photos?: WorkspacePhotoItem[];
  multiple_workspace_photos_enabled?: boolean;
};

export type ReservationUser = {
  id: number;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
};

export type Reservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  can_modify?: boolean;
  attendees_count?: number | null;
  notes?: string | null;
  total_price?: number | string | null;
  workspace?: ReservationWorkspace | null;
  user?: ReservationUser | null;
};