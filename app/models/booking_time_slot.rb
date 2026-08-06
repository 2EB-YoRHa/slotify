class BookingTimeSlot < ApplicationRecord
  DAYS_OF_WEEK = %w[
    monday
    tuesday
    wednesday
    thursday
    friday
    saturday
    sunday
  ].freeze

  belongs_to :organization

  before_validation :normalize_name
  before_validation :normalize_days_of_week

  validates :name,
            presence: true,
            length: {
              minimum: 3,
              maximum: 60
            },
            uniqueness: {
              scope: :organization_id,
              case_sensitive: false
            }

  validates :start_minute,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 1_439
            }

  validates :end_minute,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 1,
              less_than_or_equal_to: 1_440
            }

  validates :active,
            inclusion: {
              in: [ true, false ]
            }

  validate :end_must_be_after_start
  validate :days_must_be_valid
  validate :custom_time_slots_must_be_enabled

  def days
    days_of_week.to_s.split(",").filter_map do |day|
      normalized_day = day.strip.downcase

      normalized_day if normalized_day.in?(DAYS_OF_WEEK)
    end
  end

  def start_time_label
    minute_label(start_minute)
  end

  def end_time_label
    minute_label(end_minute)
  end

  def duration_minutes
    return 0 if start_minute.blank? || end_minute.blank?

    end_minute - start_minute
  end

  def available_on?(date)
    day_name = date.strftime("%A").downcase

    days.include?(day_name)
  end

  def as_json(options = {})
    super(
      {
        only: [
          :id,
          :name,
          :start_minute,
          :end_minute,
          :days_of_week,
          :active,
          :created_at,
          :updated_at
        ],
        methods: [
          :days,
          :start_time_label,
          :end_time_label,
          :duration_minutes
        ]
      }.merge(options)
    )
  end

  private

  def normalize_name
    self.name = name.to_s.strip
  end

  def normalize_days_of_week
    normalized_days = days_of_week.to_s.split(",").map do |day|
      day.strip.downcase
    end.reject(&:blank?)

    self.days_of_week = normalized_days.uniq.join(",")
  end

  def end_must_be_after_start
    return if start_minute.blank? || end_minute.blank?

    if end_minute <= start_minute
      errors.add(
        :end_minute,
        "must be after the start time"
      )
    end
  end

  def days_must_be_valid
    raw_days = days_of_week.to_s.split(",").map do |day|
      day.strip.downcase
    end.reject(&:blank?)

    if raw_days.blank?
      errors.add(:days_of_week, "must include at least one day")
      return
    end

    invalid_days = raw_days - DAYS_OF_WEEK

    return if invalid_days.blank?

    errors.add(
      :days_of_week,
      "contains invalid days"
    )
  end

  def custom_time_slots_must_be_enabled
    return if organization.blank?
    return if organization.custom_time_slots_enabled?

    errors.add(
      :base,
      "Custom time slots are only available on the Pro plan"
    )
  end

  def minute_label(value)
    hours = value / 60
    minutes = value % 60

    format("%02d:%02d", hours, minutes)
  end
end
