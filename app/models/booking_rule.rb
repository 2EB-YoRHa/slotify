class BookingRule < ApplicationRecord
  belongs_to :organization

  validates :max_hours_per_reservation,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than: 0,
              less_than_or_equal_to: 12
            }

  validates :min_notice_minutes,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 10_080
            }

  validates :cancellation_limit_hours,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0,
              less_than_or_equal_to: 168
            }

  validates :allow_weekend_bookings,
            inclusion: {
              in: [ true, false ]
            }

  validate :respect_current_plan_booking_rule_limits

  private

  def respect_current_plan_booking_rule_limits
    return if organization.blank?

    constraints = organization.booking_rule_constraints

    validate_dynamic_range(
      :max_hours_per_reservation,
      "Maximum Reservation Duration",
      constraints[:max_hours_per_reservation_min],
      constraints[:max_hours_per_reservation_max]
    )

    validate_dynamic_range(
      :min_notice_minutes,
      "Minimum Notice",
      constraints[:min_notice_minutes_min],
      constraints[:min_notice_minutes_max]
    )

    validate_dynamic_range(
      :cancellation_limit_hours,
      "Cancellation Limit",
      constraints[:cancellation_limit_hours_min],
      constraints[:cancellation_limit_hours_max]
    )
  end

  def validate_dynamic_range(attribute, label, minimum, maximum)
    value = public_send(attribute)

    return if value.blank?
    return unless value.is_a?(Numeric)

    if minimum.present? && value < minimum
      errors.add(
        attribute,
        "must be greater than or equal to #{minimum} on the #{plan_label} plan"
      )
    end

    return unless maximum.present? && value > maximum

    errors.add(
      attribute,
      "must be less than or equal to #{maximum} on the #{plan_label} plan"
    )
  end

  def plan_label
    organization.current_plan.to_s
                .tr("_", " ")
                .titleize
  end
end
