class SubscriptionsController < InertiaController
  before_action :require_manager_or_admin!

  def show
    render inertia: "subscriptions/show", props: subscription_props
  end

  def checkout
    if current_organization.active_stripe_subscription.present?
      portal_session = Subscriptions::CreatePortalSession.new(
        organization: current_organization,
        return_url: subscription_url
      ).call

      inertia_location portal_session.url
      return
    end

    success_url = "#{success_subscription_url}?session_id={CHECKOUT_SESSION_ID}"

    session = Subscriptions::CreateCheckoutSession.new(
      organization: current_organization,
      user: current_user,
      plan_key: params[:plan],
      success_url: success_url,
      cancel_url: cancel_subscription_url
    ).call

    inertia_location session.url
  rescue ArgumentError, Stripe::StripeError, StandardError => e
    redirect_to subscription_path,
                alert: e.message
  end

  def portal
    session = Subscriptions::CreatePortalSession.new(
      organization: current_organization,
      return_url: subscription_url
    ).call

    inertia_location session.url
  rescue Stripe::StripeError, StandardError => e
    redirect_to subscription_path,
                alert: e.message
  end

  def success
    if params[:session_id].blank? || params[:session_id] == "{CHECKOUT_SESSION_ID}"
      redirect_to subscription_path,
                  alert: "Stripe did not return a valid checkout session. Please try the checkout again."

      return
    end

    checkout_session = Stripe::Checkout::Session.retrieve(params[:session_id])

    unless checkout_session.client_reference_id.to_s == current_organization.id.to_s
      redirect_to subscription_path,
                  alert: "Checkout session does not belong to this organization."

      return
    end

    plan_key = checkout_session.metadata["plan_key"]
    stripe_subscription_id = checkout_session.subscription
    stripe_price_id = SubscriptionPlan.stripe_price_id(plan_key)
    ends_at = stripe_subscription_period_end(stripe_subscription_id)

    Subscriptions::ApplyStripeSubscription.new(
      organization: current_organization,
      plan_key: plan_key,
      status: "active",
      stripe_subscription_id: stripe_subscription_id,
      stripe_price_id: stripe_price_id,
      stripe_checkout_session_id: checkout_session.id,
      ends_at: ends_at
    ).call

    redirect_to subscription_path,
                notice: "Subscription updated successfully."
  rescue Stripe::StripeError, ArgumentError, ActiveRecord::RecordInvalid => e
    redirect_to subscription_path,
                alert: e.message
  end

  def cancel
    redirect_to subscription_path,
                alert: "Subscription checkout was cancelled."
  end

  private

  def subscription_props
    subscription = current_organization.active_subscription

    {
      organization: current_organization.as_json(
        only: [
          :id,
          :name,
          :slug,
          :email,
          :phone,
          :address
        ]
      ),
      subscription: subscription,
      plans: SubscriptionPlan.frontend_plans,
      usage: current_organization.plan_usage,
      can_manage_billing: current_organization.stripe_customer_id.present?,
      can_start_checkout: current_organization.can_start_subscription_checkout?
    }
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
