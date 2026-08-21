export type BookingRule = {
  id: number;
  max_hours_per_reservation: number;
  min_notice_minutes: number;
  cancellation_limit_hours: number;
  allow_weekend_bookings: boolean;
};

export type BookingRuleFormData = {
  max_hours_per_reservation: string | number;
  min_notice_minutes: string | number;
  cancellation_limit_hours: string | number;
  allow_weekend_bookings: boolean;
};

export type BookingRuleErrors = Partial<
  Record<keyof BookingRuleFormData, string | string[]>
>;

export type PlanEntitlements = {
  advanced_booking_rules: boolean;
  custom_time_slots: boolean;
  usage_insights: boolean;
  availability_command_center: boolean;
  multiple_workspace_photos: boolean;
  priority_support: boolean;
};

export type BookingRuleConstraints = {
  max_hours_per_reservation_min: number;
  max_hours_per_reservation_max: number;
  min_notice_minutes_min: number;
  min_notice_minutes_max: number;
  cancellation_limit_hours_min: number;
  cancellation_limit_hours_max: number;
};