export type BookingRule = {
  id: number;
  max_hours_per_reservation?: number | null;
  min_notice_minutes?: number | null;
  cancellation_limit_hours?: number | null;
  allow_weekend_bookings?: boolean | null;
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