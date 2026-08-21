import type { LucideIcon } from "lucide-react";

export type SharedCurrentUser = {
  id?: number;
  name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  role?: string | null;
  organization_id?: number | null;
  organization_name?: string | null;
  current_plan?: string | null;
  billing_required?: boolean;
  subscription_active?: boolean;
};

export type SharedPageProps = {
  current_user?: SharedCurrentUser | null;
};

export type HeaderMeta = {
  title: string;
  description: string;
};

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
};