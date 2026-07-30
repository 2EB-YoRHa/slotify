class Subscription < ApplicationRecord
  belongs_to :organization
  has_many :payments, dependent: :destroy

  validates :plan_name, presence: true
  validates :status, presence: true

  validates :plan_name,
            inclusion: {
              in: SubscriptionPlan::CATALOG.keys
            }

  def active?
    status == "active"
  end

  def starter?
    plan_name == "starter"
  end

  def pro?
    plan_name == "pro"
  end
end
