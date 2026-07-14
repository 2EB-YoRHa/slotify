import type { Amenity } from "./amenity";

export type Workspace = {
  id: number;
  name: string;
  workspace_type: string;
  capacity: number;
  floor?: string | null;
  zone?: string | null;
  location?: string | null;
  description?: string | null;
  hourly_rate?: number | string | null;
  active: boolean;
  amenities?: Amenity[];
};

export type WorkspaceFormData = {
  name: string;
  workspace_type: string;
  capacity: string | number;
  floor: string;
  zone: string;
  location: string;
  description: string;
  hourly_rate: string | number;
  active: boolean;
  amenity_ids: number[];
};

export type WorkspaceErrors = Partial<
  Record<keyof WorkspaceFormData, string | string[]>
>;