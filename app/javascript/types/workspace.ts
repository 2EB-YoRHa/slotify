import type { Amenity } from "./amenity";

export type WorkspacePhotoItem = {
  id: number;
  url: string;
  filename: string;
  content_type?: string | null;
  byte_size?: number | null;
};

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
  photo_attached?: boolean;
  photo_url?: string | null;
  photo_filename?: string | null;
  extra_photos?: WorkspacePhotoItem[];
  gallery_photos?: WorkspacePhotoItem[];
  multiple_workspace_photos_enabled?: boolean;
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
  photo: File | null;
  extra_photos: File[];
};

export type WorkspaceErrors = Partial<
  Record<keyof WorkspaceFormData, string | string[]>
>;