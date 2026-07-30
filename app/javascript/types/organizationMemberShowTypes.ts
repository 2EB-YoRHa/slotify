import type { Role } from "../types/organization";

export type OrganizationMember = {
  id: number;
  name: string;
  email: string;
  active: boolean;
  created_at?: string | null;
  role?: Role | null;
};

export type MemberReservation = {
  id: number;
  workspace_name: string;
  start_time: string;
  end_time: string;
  status: string;
};