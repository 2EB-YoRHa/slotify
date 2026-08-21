class Reservation < ApplicationRecord
  STATUSES = %w[confirmed cancelled concluded].freeze
  ACTIVE_STATUSES = %w[confirmed].freeze

  belongs_to :organization
  belongs_to :user
  belongs_to :workspace

  before_validation :normalize_status

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true, inclusion: { in: STATUSES }

  validates :attendees_count,
            numericality: {
              only_integer: true,
              greater_than: 0
            }

  validates :notes,
            length: {
              maximum: 500
            },
            allow_blank: true

  validate :end_time_after_start_time

  validate :workspace_available
  validate :attendees_count_within_workspace_capacity
  validate :within_booking_rules
  validate :within_custom_time_slots

  def cancelled?
    status == "cancelled"
  end

  def concluded?
    status == "concluded" || ended_without_cancellation?
  end

  def display_status
    return "cancelled" if cancelled?
    return "concluded" if concluded?

    "confirmed"
  end

  def modifiable?
    status == "confirmed" && !concluded?
  end

  private

  def normalize_status
    self.status = "confirmed" if status.blank? || status == "pending"
    self.status = "concluded" if status == "completed"

    if status == "confirmed" && ended_without_cancellation?
      self.status = "concluded"
    end
  end

  def ended_without_cancellation?
    return false if status == "cancelled"

    end_time.present? && end_time < Time.current
  end

  def end_time_after_start_time
    return if start_time.blank? || end_time.blank?

    errors.add(:end_time, "must be after start time") if end_time <= start_time
  end

  def workspace_available
    return if workspace.blank? || start_time.blank? || end_time.blank?
    return unless status == "confirmed"

    overlapping = Reservation
      .where(workspace_id: workspace_id)
      .where.not(id: id)
      .where(status: ACTIVE_STATUSES)
      .where("start_time < ? AND end_time > ?", end_time, start_time)

    errors.add(:base, "Workspace is already reserved for this time") if overlapping.exists?
  end

  def attendees_count_within_workspace_capacity
    return if workspace.blank? || attendees_count.blank?

    if attendees_count > workspace.capacity
      errors.add(:attendees_count, "cannot exceed workspace capacity")
    end
  end

  def within_booking_rules
    return unless status == "confirmed"
    return if organization.blank?
    return if start_time.blank? || end_time.blank?

    booking_rule = organization.booking_rule
    return if booking_rule.blank?

    validate_max_hours_per_reservation(booking_rule)
    validate_minimum_notice(booking_rule)
    validate_weekend_booking(booking_rule)
  end

  def validate_max_hours_per_reservation(booking_rule)
    return if booking_rule.max_hours_per_reservation.blank?

    duration_hours = (end_time - start_time) / 1.hour

    if duration_hours > booking_rule.max_hours_per_reservation
      errors.add(
        :base,
        "Reservation cannot exceed #{booking_rule.max_hours_per_reservation} hours."
      )
    end
  end

  def validate_minimum_notice(booking_rule)
    return if booking_rule.min_notice_minutes.blank?

    minimum_start_time = Time.current + booking_rule.min_notice_minutes.minutes

    if start_time < minimum_start_time
      errors.add(
        :base,
        "Reservation must be made at least #{booking_rule.min_notice_minutes} minutes in advance."
      )
    end
  end

  def validate_weekend_booking(booking_rule)
    return if weekend_bookings_allowed?(booking_rule)

    return unless start_time.saturday? || start_time.sunday?

    errors.add(:base, "Weekend bookings are not allowed.")
  end

  def weekend_bookings_allowed?(booking_rule)
    if booking_rule.respond_to?(:allow_weekend_bookings?)
      booking_rule.allow_weekend_bookings?
    elsif booking_rule.respond_to?(:allow_weekends?)
      booking_rule.allow_weekends?
    else
      false
    end
  end

  def within_custom_time_slots
      return unless status == "confirmed"
      return if organization.blank?
      return unless organization.custom_time_slots_enabled?
      return if start_time.blank? || end_time.blank?

      active_slots = organization.booking_time_slots.where(active: true)

      return if active_slots.blank?

      matching_slot = active_slots.any? do |slot|
        slot.available_on?(start_time.to_date) &&
          slot.start_minute == minutes_from_midnight(start_time) &&
          slot.end_minute == minutes_from_midnight(end_time)
      end

      return if matching_slot

      errors.add(
        :base,
        "Reservation must use one of the organization's active custom time slots."
      )
  end

  def minutes_from_midnight(value)
    time = value.in_time_zone

    time.hour * 60 + time.min
  end
end
