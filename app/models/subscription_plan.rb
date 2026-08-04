module SubscriptionPlan
  CATALOG = {
    "starter" => {
      key: "starter",
      name: "Starter",
      price: "$19",
      amount_cents: 1900,
      description: "Essential booking tools for small coworking spaces getting organized.",
      best_for: "Small coworkings, private studios, and teams starting with online reservations.",
      workspace_limit: 6,
      user_limit: 12,
      stripe_price_env: "STRIPE_STARTER_PRICE_ID",
      badge: "Essential",
      highlights: [
        "Reservation essentials",
        "Small team controls",
        "Simple booking rules"
      ],
      limits: [
        "Up to 6 workspaces",
        "Up to 12 member slots",
        "1 organization workspace directory"
      ],
      feature_groups: [
        {
          title: "Booking Core",
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
            "Workspace photos, descriptions, capacity, rates, and amenities",
            "Activate or deactivate workspaces without deleting history",
            "Basic workspace availability checks"
          ]
        },
        {
          title: "Team Access",
          items: [
            "Invite members by email",
            "Manager and member roles",
            "Basic organization profile management"
          ]
        }
      ],
      features: [
        "Up to 6 workspaces",
        "Up to 12 member slots",
        "Reservation management",
        "Workspace photos and amenities",
        "Member invitations",
        "Basic booking rules",
        "Overlap protection"
      ]
    },
    "pro" => {
      key: "pro",
      name: "Pro",
      price: "$49",
      amount_cents: 4900,
      description: "Advanced operations for growing coworking spaces that need more control.",
      best_for: "Growing coworkings, multi-room operations, and managers who need stronger visibility.",
      workspace_limit: nil,
      user_limit: nil,
      stripe_price_env: "STRIPE_PRO_PRICE_ID",
      badge: "Recommended",
      highlighted: true,
      highlights: [
        "Unlimited scale",
        "Advanced operations",
        "Management insights"
      ],
      limits: [
        "Unlimited workspaces",
        "Unlimited member slots",
        "Built for growing operations"
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
          title: "Operational Control",
          items: [
            "Unlimited workspaces and member slots",
            "Stronger availability management for busy teams",
            "Better visibility into workspace usage and booking activity",
            "Manager tools for larger organizations"
          ]
        },
        {
          title: "Growth Features",
          items: [
            "Ready for advanced reporting",
            "Ready for custom time slots",
            "Ready for availability command center",
            "Designed for future premium controls"
          ]
        }
      ],
      features: [
        "Unlimited workspaces",
        "Unlimited member slots",
        "Everything in Starter",
        "Advanced availability management",
        "Workspace usage insights",
        "Manager-level operational controls",
        "Ready for custom time slots",
        "Ready for availability command center"
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
