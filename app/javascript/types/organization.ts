export type Organization = {
  id: number;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type Role = {
  id: number;
  name: string;
};

export type OrganizationUser = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  role?: Role | null;
};

export type BookingRule = {
  id: number;
  max_hours_per_reservation?: number | null;
  min_notice_minutes?: number | null;
  cancellation_limit_hours?: number | null;
  allow_weekend_bookings?: boolean | null;
};

export type Subscription = {
  id: number;
  plan_name: string;
  status: string;
  starts_at?: string | null;
  ends_at?: string | null;
};

export type OrganizationFormData = {
  name: string;
  slug: string;
  email: string;
  phone: string;
  address: string;
};

export type OrganizationErrors = Partial<
  Record<keyof OrganizationFormData, string | string[]>
>;