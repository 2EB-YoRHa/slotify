import type { Amenity } from "../././types/amenity";
import type { Workspace } from "../././types/workspace";

export type WorkspaceWithAmenities = Workspace & {
  amenities?: Amenity[];
};

export type WorkspaceReservation = {
  id: number;
  start_time: string;
  end_time: string;
  status: string;
  user?: {
    id: number;
    name: string;
    email?: string | null;
    avatar_url?: string | null;
  } | null;
};