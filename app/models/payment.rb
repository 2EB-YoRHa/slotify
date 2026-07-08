class Payment < ApplicationRecord
  belongs_to :subscription

  validates :amount, presence: true, numericality: { greater_than_or_equal_to: 0 }
  validates :status, presence: true
end
