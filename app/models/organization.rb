class Organization < ApplicationRecord
  ACTIVE_SUBSCRIPTION_STATUSES = Subscription::ACTIVE_STATUSES

  has_many :users, dependent: :destroy
  has_many :workspaces, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :organization_invitations, dependent: :destroy
  has_one :booking_rule, dependent: :destroy

  validates :name, presence: true
  validates :slug, presence: true, uniqueness: true

  def active_subscription
    subscriptions
      .where(status: ACTIVE_SUBSCRIPTION_STATUSES)
      .order(created_at: :desc)
      .first
  end

  def active_stripe_subscription
    subscriptions
      .where(status: ACTIVE_SUBSCRIPTION_STATUSES)
      .where.not(stripe_subscription_id: [ nil, "" ])
      .order(created_at: :desc)
      .first
  end

  def current_subscription
    active_subscription || subscriptions.order(created_at: :desc).first
  end

  def current_plan
    active_subscription&.plan_name || "starter"
  end

  def workspace_limit
    subscription = active_subscription

    return SubscriptionPlan.find!("starter")[:workspace_limit] if subscription.blank?

    subscription.workspace_limit
  end

  def user_limit
    subscription = active_subscription

    return SubscriptionPlan.find!("starter")[:user_limit] if subscription.blank?

    subscription.user_limit
  end

  def workspaces_used
    workspaces.count
  end

  def users_used
    users.count
  end

  def pending_invitation_slots(excluding_invitation: nil)
    invitations = organization_invitations.where(status: "pending")

    if excluding_invitation.present?
      invitations = invitations.where.not(id: excluding_invitation.id)
    end

    invitations.count
  end

  def member_slots_used(excluding_invitation: nil)
    users_used + pending_invitation_slots(
      excluding_invitation: excluding_invitation
    )
  end

  def workspace_limit_reached?
    return false if workspace_limit.blank?

    workspaces_used >= workspace_limit
  end

  def user_limit_reached?(excluding_invitation: nil)
    return false if user_limit.blank?

    member_slots_used(
      excluding_invitation: excluding_invitation
    ) >= user_limit
  end

  def user_limit_available?(excluding_invitation: nil)
    !user_limit_reached?(
      excluding_invitation: excluding_invitation
    )
  end

  def can_start_subscription_checkout?
    active_stripe_subscription.blank?
  end

  def plan_usage
    {
      workspaces_used: workspaces_used,
      workspace_limit: workspace_limit,
      users_used: users_used,
      pending_invitations: pending_invitation_slots,
      member_slots_used: member_slots_used,
      user_limit: user_limit
    }
  end
end
