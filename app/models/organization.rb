class Organization < ApplicationRecord
  ACTIVE_SUBSCRIPTION_STATUSES = Subscription::ACTIVE_STATUSES
  BILLING_REQUIRED_PLAN = "billing_required"
  BILLING_REQUIRED_WORKSPACE_LIMIT = 0
  BILLING_REQUIRED_USER_LIMIT = 1

  SLUG_FORMAT = /\A[a-z0-9]+(?:-[a-z0-9]+)*\z/
  EMAIL_FORMAT = URI::MailTo::EMAIL_REGEXP
  PHONE_FORMAT = /\A[\d\s+\-().]+\z/

  has_many :users, dependent: :destroy
  has_many :workspaces, dependent: :destroy
  has_many :reservations, dependent: :destroy
  has_many :subscriptions, dependent: :destroy
  has_many :organization_invitations, dependent: :destroy
  has_one :booking_rule, dependent: :destroy

  before_validation :normalize_slug
  before_validation :normalize_contact_fields
  before_validation :assign_unique_slug,
                    if: :should_assign_unique_slug?

  validates :name,
            presence: true,
            length: {
              minimum: 3,
              maximum: 100
            }

  validates :email,
            format: {
              with: EMAIL_FORMAT
            },
            allow_blank: true

  validates :phone,
            length: {
              maximum: 30
            },
            format: {
              with: PHONE_FORMAT,
              message: "can only include numbers, spaces, +, -, parentheses, and dots"
            },
            allow_blank: true

  validates :address,
            length: {
              maximum: 200
            },
            allow_blank: true

  validates :slug,
            presence: true,
            uniqueness: {
              case_sensitive: false
            },
            format: {
              with: SLUG_FORMAT,
              message: "must contain only lowercase letters, numbers, and hyphens"
            }

  def self.normalize_slug(value)
    value.to_s.parameterize
  end

  def self.unique_slug_for(value, ignored_id: nil)
    base_slug = normalize_slug(value).presence || "organization"
    slug = base_slug
    counter = 2

    scope = all
    scope = scope.where.not(id: ignored_id) if ignored_id.present?

    while scope.exists?(slug: slug)
      slug = "#{base_slug}-#{counter}"
      counter += 1
    end

    slug
  end

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

  def subscription_active?
    active_subscription.present?
  end

  def billing_required?
    active_subscription.blank?
  end

  def current_plan
    return BILLING_REQUIRED_PLAN if billing_required?

    active_subscription.plan_name
  end

  def current_plan_definition
    return nil if billing_required?

    SubscriptionPlan.find(current_plan) || SubscriptionPlan.find!("starter")
  end

  def plan_entitlements
    SubscriptionPlan.entitlements_for(current_plan)
  end

  def booking_rule_constraints
    SubscriptionPlan.booking_rule_constraints_for(current_plan)
  end

  def feature_enabled?(feature_key)
    plan_entitlements[feature_key.to_sym] == true
  end

  def pro_plan?
    current_plan == "pro"
  end

  def starter_plan?
    current_plan == "starter"
  end

  def advanced_booking_rules_enabled?
    feature_enabled?(:advanced_booking_rules)
  end

  def custom_time_slots_enabled?
    feature_enabled?(:custom_time_slots)
  end

  def usage_insights_enabled?
    feature_enabled?(:usage_insights)
  end

  def availability_command_center_enabled?
    feature_enabled?(:availability_command_center)
  end

  def multiple_workspace_photos_enabled?
    feature_enabled?(:multiple_workspace_photos)
  end

  def priority_support_enabled?
    feature_enabled?(:priority_support)
  end

  def workspace_limit
    return BILLING_REQUIRED_WORKSPACE_LIMIT if billing_required?

    plan_limit_for(:workspace_limit)
  end

  def user_limit
    return BILLING_REQUIRED_USER_LIMIT if billing_required?

    plan_limit_for(:user_limit)
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
    return false if workspace_limit.nil?

    workspaces_used >= workspace_limit
  end

  def user_limit_reached?(excluding_invitation: nil)
    return false if user_limit.nil?

    member_slots_used(
      excluding_invitation: excluding_invitation
    ) >= user_limit
  end

  def user_limit_available?(excluding_invitation: nil)
    !user_limit_reached?(
      excluding_invitation: excluding_invitation
    )
  end

  def workspace_over_limit?
    return false if workspace_limit.nil?

    workspaces_used > workspace_limit
  end

  def user_over_limit?
    return false if user_limit.nil?

    member_slots_used > user_limit
  end

  def over_plan_limits?
    workspace_over_limit? || user_over_limit?
  end

  def workspace_slots_remaining
    return nil if workspace_limit.nil?

    [ workspace_limit - workspaces_used, 0 ].max
  end

  def member_slots_remaining
    return nil if user_limit.nil?

    [ user_limit - member_slots_used, 0 ].max
  end

  def can_start_subscription_checkout?
    active_stripe_subscription.blank?
  end

  def plan_usage
    {
      current_plan: current_plan,
      billing_required: billing_required?,
      workspaces_used: workspaces_used,
      workspace_limit: workspace_limit,
      workspace_slots_remaining: workspace_slots_remaining,
      workspace_over_limit: workspace_over_limit?,
      users_used: users_used,
      pending_invitations: pending_invitation_slots,
      member_slots_used: member_slots_used,
      user_limit: user_limit,
      member_slots_remaining: member_slots_remaining,
      user_over_limit: user_over_limit?,
      over_plan_limits: over_plan_limits?,
      entitlements: plan_entitlements,
      booking_rule_constraints: booking_rule_constraints
    }
  end

  private

  def plan_limit_for(limit_key)
    subscription = active_subscription

    return nil if subscription.blank?

    plan = SubscriptionPlan.find(subscription.plan_name) ||
           SubscriptionPlan.find!("starter")

    catalog_limit = plan[limit_key]

    return nil if catalog_limit.nil?

    stored_limit = subscription.public_send(limit_key)

    stored_limit.nil? ? catalog_limit : stored_limit
  end

  def normalize_contact_fields
    self.name = name.to_s.strip
    self.email = email.to_s.strip.downcase
    self.phone = phone.to_s.strip
    self.address = address.to_s.strip
  end

  def normalize_slug
    self.slug = self.class.normalize_slug(slug.presence || name)
  end

  def assign_unique_slug
    self.slug = self.class.unique_slug_for(
      slug,
      ignored_id: id
    )
  end

  def should_assign_unique_slug?
    new_record? || will_save_change_to_slug?
  end
end
