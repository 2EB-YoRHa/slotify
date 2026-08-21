export type ProfileOrganization = {
  id: number;
  name?: string | null;
  slug?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type UserProfile = {
  id: number;
  name: string;
  email: string;
  role?: string | null;
  active?: boolean;
  two_factor_enabled?: boolean;
  avatar_url?: string | null;
  organization?: ProfileOrganization | null;
  created_at?: string | null;
  updated_at?: string | null;
  confirmed?: boolean;
  confirmed_at?: string | null;
  pending_email?: string | null;
};

export type ProfileFormData = {
  user: {
    name: string;
    email: string;
    avatar: File | null;
    remove_avatar: boolean;
    current_password: string;
  };
};