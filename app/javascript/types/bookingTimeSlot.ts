export type BookingTimeSlot = {
  id: number;
  name: string;
  start_minute: number;
  end_minute: number;
  days_of_week: string;
  active: boolean;
  created_at?: string;
  updated_at?: string;
  days?: string[];
  start_time_label?: string;
  end_time_label?: string;
  duration_minutes?: number;
};

export type BookingTimeSlotFormData = {
  name: string;
  start_time: string;
  end_time: string;
  days_of_week: string[];
  active: boolean;
};

export type BookingTimeSlotErrors = Partial<
  Record<keyof BookingTimeSlotFormData | "base", string | string[]>
>;