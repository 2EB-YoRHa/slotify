class Reservation < ApplicationRecord
  belongs_to :organization
  belongs_to :user
  belongs_to :workspace

  validates :start_time, presence: true
  validates :end_time, presence: true
  validates :status, presence: true
  validates :attendees_count, numericality: { greater_than: 0 }

  validate :end_time_after_start_time
  validate :workspace_available
  validate :attendees_count_within_workspace_capacity

  validate :within_booking_rules

  private

    def end_time_after_start_time
      return if start_time.blank? || end_time.blank?

      errors.add(:end_time, "must be after start time") if end_time <= start_time
    end

    def workspace_available
      return if workspace.blank? || start_time.blank? || end_time.blank?

      overlapping = Reservation
        .where(workspace_id: workspace_id)
        .where.not(id: id)
        .where.not(status: "cancelled")
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
    return if status == "cancelled"
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
    return if booking_rule.allow_weekend_bookings?

    if start_time.saturday? || start_time.sunday?
      errors.add(:base, "Weekend bookings are not allowed.")
    end
  end
end
