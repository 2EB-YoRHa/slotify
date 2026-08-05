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

  plan_name?: string | null;
  starts_at?: string | null;
  ends_at?: string | null;
  workspace_limit?: number | null;
  user_limit?: number | null;
  stripe_subscription_id?: string | null;
  stripe_price_id?: string | null;
  stripe_checkout_session_id?: string | null;

  plan?: string | null;
  started_at?: string | null;
  expires_at?: string | null;

  status?: string | null;
};

export type SubscriptionFeatureGroup = {
  title: string;
  items: string[];
};

export type SubscriptionPlan = {
  key: string;
  name: string;
  price: string;
  amount_cents: number;
  description: string;
  best_for?: string;
  badge?: string;
  workspace_limit?: number | null;
  user_limit?: number | null;
  limits?: string[];
  highlights?: string[];
  feature_groups?: SubscriptionFeatureGroup[];
  features: string[];
  highlighted?: boolean;
  checkout_ready?: boolean;
};

export type SubscriptionUsage = {
  current_plan?: string;
  billing_required?: boolean;
  workspaces_used: number;
  workspace_limit?: number | null;
  workspace_slots_remaining?: number | null;
  workspace_over_limit?: boolean;
  users_used: number;
  pending_invitations: number;
  member_slots_used: number;
  user_limit?: number | null;
  member_slots_remaining?: number | null;
  user_over_limit?: boolean;
  over_plan_limits?: boolean;
};