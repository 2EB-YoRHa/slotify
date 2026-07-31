module SubscriptionPlan
  CATALOG = {
    "starter" => {
      key: "starter",
      name: "Starter",
      price: "$19",
      amount_cents: 1900,
      description: "For small coworking spaces that need basic booking control.",
      workspace_limit: 10,
      user_limit: 20,
      stripe_price_env: "STRIPE_STARTER_PRICE_ID",
      features: [
        "Up to 10 workspaces",
        "Up to 20 members",
        "Reservation management",
        "Member invitations",
        "Basic booking rules"
      ]
    },
    "pro" => {
      key: "pro",
      name: "Pro",
      price: "$49",
      amount_cents: 4900,
      description: "For growing teams that need stronger workspace management.",
      workspace_limit: nil,
      user_limit: nil,
      stripe_price_env: "STRIPE_PRO_PRICE_ID",
      highlighted: true,
      features: [
        "Unlimited workspaces",
        "Unlimited members",
        "Availability checks",
        "Member access control",
        "Organization management",
        "Dashboard insights"
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
