class BookingRule < ApplicationRecord
  belongs_to :organization

  validates :max_hours_per_reservation, numericality: { greater_than: 0 }, allow_nil: true
  validates :min_notice_minutes, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
  validates :cancellation_limit_hours, numericality: { greater_than_or_equal_to: 0 }, allow_nil: true
end
