class Subscription < ApplicationRecord
  belongs_to :organization
  has_many :payments, dependent: :destroy

  validates :plan_name, presence: true
  validates :status, presence: true
end
