class Subscription < ApplicationRecord
  ACTIVE_STATUSES = %w[active trialing].freeze

  belongs_to :organization
  has_many :payments, dependent: :destroy

  validates :plan_name, presence: true
  validates :status, presence: true

  validates :plan_name,
            inclusion: {
              in: SubscriptionPlan::CATALOG.keys
            }

  validates :stripe_subscription_id,
            uniqueness: true,
            allow_blank: true

  validates :stripe_checkout_session_id,
            uniqueness: true,
            allow_blank: true

  validate :only_one_active_subscription_per_organization,
           if: :active_status?

  scope :active_statuses, -> { where(status: ACTIVE_STATUSES) }

  def active?
    status == "active"
  end

  def trialing?
    status == "trialing"
  end

  def active_status?
    ACTIVE_STATUSES.include?(status)
  end

  def starter?
    plan_name == "starter"
  end

  def pro?
    plan_name == "pro"
  end

  private

  def only_one_active_subscription_per_organization
    return if organization_id.blank?

    duplicate_scope = Subscription.where(
      organization_id: organization_id,
      status: ACTIVE_STATUSES
    )

    duplicate_scope = duplicate_scope.where.not(id: id) if persisted?

    return unless duplicate_scope.exists?

    errors.add(
      :base,
      "Organization already has an active subscription"
    )
  end
end
