export type OrganizationSummary = {
  id: number;
  name: string;
  slug: string;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
};

export type Subscription = {
  id: number;

  // New Stripe-ready fields
  plan_name?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  workspace_limit?: number | null;
  user_limit?: number | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  stripe_checkout_session_id?: string | null;

  // Legacy fields already used by the app before Stripe
  plan?: string | null;
  started_at?: string | null;
  expires_at?: string | null;

  status?: string | null;
};

export type SubscriptionPlan = {
  key: string;
  name: string;
  price: string;
  amount_cents: number;
  description: string;
  workspace_limit?: number | null;
  user_limit?: number | null;
  features: string[];
  highlighted?: boolean;
  checkout_ready?: boolean;
};

export type SubscriptionUsage = {
  workspaces_used: number;
  workspace_limit?: number | null;
  users_used: number;
  pending_invitations: number;
  member_slots_used: number;
  user_limit?: number | null;
};