module SubscriptionPlan
  BILLING_REQUIRED_ENTITLEMENTS = {
    advanced_booking_rules: false,
    custom_time_slots: false,
    usage_insights: false,
    availability_command_center: false,
    multiple_workspace_photos: false,
    priority_support: false
  }.freeze

  BILLING_REQUIRED_BOOKING_RULE_CONSTRAINTS = {
    max_hours_per_reservation_min: 1,
    max_hours_per_reservation_max: 1,
    min_notice_minutes_min: 60,
    min_notice_minutes_max: 60,
    cancellation_limit_hours_min: 24,
    cancellation_limit_hours_max: 24
  }.freeze

  CATALOG = {
    "starter" => {
      key: "starter",
      name: "Starter",
      price: "$19",
      amount_cents: 1900,
      description: "Essential reservation operations for small coworking spaces.",
      best_for: "Small coworkings that need reliable workspace booking without advanced operational complexity.",
      workspace_limit: 10,
      user_limit: 15,
      stripe_price_env: "STRIPE_STARTER_PRICE_ID",
      badge: "Essential",
      highlighted: false,
      entitlements: {
        advanced_booking_rules: false,
        custom_time_slots: false,
        usage_insights: false,
        availability_command_center: false,
        multiple_workspace_photos: false,
        priority_support: false
      },
      booking_rule_constraints: {
        max_hours_per_reservation_min: 1,
        max_hours_per_reservation_max: 4,
        min_notice_minutes_min: 0,
        min_notice_minutes_max: 1_440,
        cancellation_limit_hours_min: 0,
        cancellation_limit_hours_max: 72
      },
      highlights: [
        "Core reservations",
        "Small team access",
        "Standard booking rules"
      ],
      limits: [
        "Up to 10 workspaces",
        "Up to 15 member slots",
        "Standard booking rule limits"
      ],
      feature_groups: [
        {
          title: "Reservation Core",
          items: [
            "Create and manage workspace reservations",
            "Prevent overlapping confirmed reservations",
            "Allow members to book available spaces",
            "Reservation history with confirmed, cancelled, and concluded states"
          ]
        },
        {
          title: "Workspace Management",
          items: [
            "Create up to 10 workspaces",
            "Add capacity, rates, descriptions, amenities, and one workspace photo",
            "Activate or deactivate workspaces without deleting reservation history"
          ]
        },
        {
          title: "Standard Controls",
          items: [
            "Invite up to 15 member slots",
            "Use manager and member roles",
            "Configure standard booking rules up to 4 hours per reservation"
          ]
        }
      ],
      features: [
        "Up to 10 workspaces",
        "Up to 15 member slots",
        "Reservation management",
        "Overlap protection",
        "Workspace photos and amenities",
        "Member invitations",
        "Standard booking rules"
      ]
    },
    "pro" => {
      key: "pro",
      name: "Pro",
      price: "$49",
      amount_cents: 4900,
      description: "Advanced coworking operations for teams that need scale, visibility, and stronger control.",
      best_for: "Growing coworkings with more rooms, more members, and a need for advanced scheduling control.",
      workspace_limit: nil,
      user_limit: nil,
      stripe_price_env: "STRIPE_PRO_PRICE_ID",
      badge: "Recommended",
      highlighted: true,
      entitlements: {
        advanced_booking_rules: true,
        custom_time_slots: true,
        usage_insights: true,
        availability_command_center: true,
        multiple_workspace_photos: true,
        priority_support: true
      },
      booking_rule_constraints: {
        max_hours_per_reservation_min: 1,
        max_hours_per_reservation_max: 12,
        min_notice_minutes_min: 0,
        min_notice_minutes_max: 10_080,
        cancellation_limit_hours_min: 0,
        cancellation_limit_hours_max: 168
      },
      highlights: [
        "Unlimited scale",
        "Advanced rules",
        "Operational insights"
      ],
      limits: [
        "Unlimited workspaces",
        "Unlimited member slots",
        "Advanced booking rule limits"
      ],
      feature_groups: [
        {
          title: "Everything in Starter",
          items: [
            "All reservation, workspace, amenity, invitation, and role features",
            "All booking validation and overlap protection",
            "Full member booking experience"
          ]
        },
        {
          title: "Advanced Operations",
          items: [
            "Unlimited workspaces and member slots",
            "Reservations up to 12 hours",
            "Booking notice and cancellation limits up to 7 days",
            "Ready for custom time slot configuration"
          ]
        },
        {
          title: "Premium Visibility",
          items: [
            "Usage insights entitlement",
            "Availability Command Center entitlement",
            "Multiple workspace photo entitlement",
            "Priority support entitlement"
          ]
        }
      ],
      features: [
        "Unlimited workspaces",
        "Unlimited member slots",
        "Everything in Starter",
        "Advanced booking rules",
        "Custom time slots",
        "Usage insights",
        "Availability Command Center",
        "Multiple workspace photos",
        "Priority support"
      ]
    }
  }.freeze

  module_function

  def all
    CATALOG.values
  end

  def find(key)
    CATALOG[key.to_s]
  end

  def find!(key)
    plan = find(key)

    raise ArgumentError, "Invalid subscription plan" if plan.blank?

    plan
  end

  def entitlements_for(plan_key)
    plan = find(plan_key)

    return BILLING_REQUIRED_ENTITLEMENTS if plan.blank?

    plan[:entitlements]
  end

  def booking_rule_constraints_for(plan_key)
    plan = find(plan_key)

    return BILLING_REQUIRED_BOOKING_RULE_CONSTRAINTS if plan.blank?

    plan[:booking_rule_constraints]
  end

  def stripe_price_id(plan_key)
    plan = find!(plan_key)
    price_id = ENV[plan[:stripe_price_env]]

    return nil if price_id.blank?

    unless price_id.start_with?("price_")
      raise ArgumentError,
            "#{plan[:stripe_price_env]} must be a Stripe Price ID that starts with price_. You used #{price_id}."
    end

    price_id
  end

  def plan_key_for_price_id(price_id)
    return nil if price_id.blank?

    CATALOG.each_value do |plan|
      return plan[:key] if ENV[plan[:stripe_price_env]] == price_id
    end

    nil
  end

  def checkout_ready?(plan_key)
    stripe_price_id(plan_key).present?
  rescue ArgumentError
    false
  end

  def frontend_plans
    all.map do |plan|
      plan.except(:stripe_price_env).merge(
        checkout_ready: checkout_ready?(plan[:key])
      )
    end
  end

  def apply_to!(
    subscription,
    plan_key:,
    status:,
    stripe_subscription_id: nil,
    stripe_price_id: nil,
    stripe_checkout_session_id: nil,
    ends_at: nil
  )
    plan = find!(plan_key)

    subscription.update!(
      plan_name: plan[:key],
      status: status,
      starts_at: subscription.starts_at || Time.current,
      ends_at: ends_at,
      workspace_limit: plan[:workspace_limit],
      user_limit: plan[:user_limit],
      stripe_subscription_id: stripe_subscription_id,
      stripe_price_id: stripe_price_id,
      stripe_checkout_session_id: stripe_checkout_session_id
    )
  end
end
