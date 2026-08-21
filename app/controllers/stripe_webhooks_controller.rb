class StripeWebhooksController < ActionController::API
  def create
    event = verified_event

    case event.type
    when "checkout.session.completed"
      handle_checkout_session_completed(event.data.object)
    when "customer.subscription.updated"
      handle_subscription_updated(event.data.object)
    when "customer.subscription.deleted"
      handle_subscription_deleted(event.data.object)
    end

    head :ok
  rescue JSON::ParserError
    render json: { error: "Invalid payload" }, status: :bad_request
  rescue Stripe::SignatureVerificationError
    render json: { error: "Invalid signature" }, status: :bad_request
  rescue ActiveRecord::RecordNotFound, ArgumentError => e
    render json: { error: e.message }, status: :unprocessable_entity
  end

  private

  def verified_event
    payload = request.body.read
    signature = request.env["HTTP_STRIPE_SIGNATURE"]
    webhook_secret = ENV["STRIPE_WEBHOOK_SECRET"]

    raise ArgumentError, "Stripe webhook secret is not configured" if webhook_secret.blank?

    Stripe::Webhook.construct_event(
      payload,
      signature,
      webhook_secret
    )
  end

  def handle_checkout_session_completed(session)
    organization = Organization.find(session.client_reference_id)
    plan_key = session.metadata["plan_key"]
    stripe_subscription_id = session.subscription
    stripe_price_id = SubscriptionPlan.stripe_price_id(plan_key)
    ends_at = stripe_subscription_period_end(stripe_subscription_id)

    Subscriptions::ApplyStripeSubscription.new(
      organization: organization,
      plan_key: plan_key,
      status: "active",
      stripe_subscription_id: stripe_subscription_id,
      stripe_price_id: stripe_price_id,
      stripe_checkout_session_id: session.id,
      ends_at: ends_at
    ).call
  end

  def handle_subscription_updated(stripe_subscription)
    organization = Organization.find_by!(
      stripe_customer_id: stripe_subscription.customer
    )

    stripe_price_id = stripe_subscription.items.data.first&.price&.id
    plan_key = SubscriptionPlan.plan_key_for_price_id(stripe_price_id)

    return if plan_key.blank?

    Subscriptions::ApplyStripeSubscription.new(
      organization: organization,
      plan_key: plan_key,
      status: stripe_subscription.status,
      stripe_subscription_id: stripe_subscription.id,
      stripe_price_id: stripe_price_id,
      ends_at: stripe_period_end(stripe_subscription)
    ).call
  end

  def handle_subscription_deleted(stripe_subscription)
    organization = Organization.find_by!(
      stripe_customer_id: stripe_subscription.customer
    )

    current_subscription = organization.current_subscription
    plan_key = current_subscription&.plan_name || "starter"

    Subscriptions::ApplyStripeSubscription.new(
      organization: organization,
      plan_key: plan_key,
      status: "cancelled",
      stripe_subscription_id: stripe_subscription.id,
      stripe_price_id: current_subscription&.stripe_price_id,
      ends_at: Time.current
    ).call
  end

  def stripe_subscription_period_end(stripe_subscription_id)
    return nil if stripe_subscription_id.blank?

    stripe_subscription = Stripe::Subscription.retrieve(stripe_subscription_id)

    stripe_period_end(stripe_subscription)
  rescue Stripe::StripeError
    nil
  end

  def stripe_period_end(stripe_subscription)
    subscription_hash = stripe_subscription.to_hash

    timestamp =
      subscription_hash[:current_period_end] ||
      subscription_hash["current_period_end"]

    if timestamp.blank?
      items = subscription_hash[:items] || subscription_hash["items"]
      data = items[:data] || items["data"] if items.present?
      first_item = data&.first

      timestamp =
        first_item[:current_period_end] ||
        first_item["current_period_end"] if first_item.present?
    end

    return nil if timestamp.blank?

    Time.zone.at(timestamp.to_i)
  end
end
