import type {
  Organization,
  OrganizationInvitation,
  OrganizationUser,
  Role,
} from ".././types/organization.ts";

export type BookingRuleSummary = {
  id: number;
  max_hours_per_reservation?: number | null;
  min_notice_minutes?: number | null;
  cancellation_limit_hours?: number | null;
  allow_weekend_bookings?: boolean | null;
  active?: boolean | null;
};

export type SubscriptionSummary = {
  id: number;
  plan_name?: string | null;
  plan?: string | null;
  status?: string | null;
  starts_at?: string | null;
  expires_at?: string | null;
  ends_at?: string | null;
};

export type OrganizationShowData = Organization;
export type OrganizationShowUser = OrganizationUser;
export type OrganizationShowRole = Role;
export type OrganizationShowInvitation = OrganizationInvitation;