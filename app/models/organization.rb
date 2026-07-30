class Organization < ApplicationRecord
  has_many :users, dependent: :destroy
  has_many :workspaces, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :organization_invitations, dependent: :destroy
  has_one :booking_rule, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  def current_subscription
    subscriptions.order(created_at: :desc).first
  end

  def current_plan
    current_subscription&.plan_name || "starter"
  end

  def workspace_limit
    current_subscription&.workspace_limit || SubscriptionPlan.find!("starter")[:workspace_limit]
  end

  def user_limit
    current_subscription&.user_limit || SubscriptionPlan.find!("starter")[:user_limit]
  end

  def workspace_limit_reached?
    return false if workspace_limit.blank?

    workspaces.count >= workspace_limit
  end

  def user_limit_reached?
    return false if user_limit.blank?

    users.count >= user_limit
  end
end
