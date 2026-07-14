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
  plan_name: string;
  status: string;
  starts_at?: string | null;
  ends_at?: string | null;
};