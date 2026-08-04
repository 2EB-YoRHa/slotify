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
end
