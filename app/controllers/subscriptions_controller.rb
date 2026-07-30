class SubscriptionsController < InertiaController
  before_action :require_manager_or_admin!

  def show
    render inertia: "subscriptions/show", props: subscription_props
  end

def checkout
  session = Subscriptions::CreateCheckoutSession.new(
    organization: current_organization,
    user: current_user,
    plan_key: params[:plan],
    success_url: success_subscription_url(session_id: "{CHECKOUT_SESSION_ID}"),
    cancel_url: cancel_subscription_url
  ).call

  inertia_location session.url
rescue ArgumentError, Stripe::StripeError, StandardError => e
  redirect_to subscription_path,
              alert: e.message
end

  def success
    checkout_session = Stripe::Checkout::Session.retrieve(params[:session_id])

    unless checkout_session.client_reference_id.to_s == current_organization.id.to_s
      redirect_to subscription_path,
                  alert: "Checkout session does not belong to this organization."

      return
    end

    plan_key = checkout_session.metadata["plan_key"]
    price_id = SubscriptionPlan.stripe_price_id(plan_key)
    ends_at = stripe_subscription_period_end(checkout_session.subscription)

    subscription = current_organization.subscriptions.create!(
      plan_name: plan_key,
      status: "active"
    )

    SubscriptionPlan.apply_to!(
      subscription,
      plan_key: plan_key,
      status: "active",
      stripe_subscription_id: checkout_session.subscription,
      stripe_price_id: price_id,
      stripe_checkout_session_id: checkout_session.id,
      ends_at: ends_at
    )

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
    subscription = current_organization.current_subscription

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
      plans: SubscriptionPlan.frontend_plans
    }
  end

  def stripe_subscription_period_end(stripe_subscription_id)
    return nil if stripe_subscription_id.blank?

    stripe_subscription = Stripe::Subscription.retrieve(stripe_subscription_id)

    return nil if stripe_subscription.current_period_end.blank?

    Time.zone.at(stripe_subscription.current_period_end)
  rescue Stripe::StripeError
    nil
  end
end
