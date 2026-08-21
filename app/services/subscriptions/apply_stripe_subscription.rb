module Subscriptions
  class ApplyStripeSubscription
    def initialize(
      organization:,
      plan_key:,
      status:,
      stripe_subscription_id: nil,
      stripe_price_id: nil,
      stripe_checkout_session_id: nil,
      ends_at: nil
    )
      @organization = organization
      @plan_key = plan_key
      @status = status
      @stripe_subscription_id = stripe_subscription_id
      @stripe_price_id = stripe_price_id
      @stripe_checkout_session_id = stripe_checkout_session_id
      @ends_at = ends_at
    end

    def call
      subscription = find_or_build_subscription

      SubscriptionPlan.apply_to!(
        subscription,
        plan_key: @plan_key,
        status: @status,
        stripe_subscription_id: @stripe_subscription_id,
        stripe_price_id: @stripe_price_id,
        stripe_checkout_session_id: @stripe_checkout_session_id,
        ends_at: @ends_at
      )

      subscription
    end

    private

    def find_or_build_subscription
      find_by_stripe_subscription ||
        find_by_checkout_session ||
        @organization.active_subscription ||
        @organization.subscriptions.build
    end

    def find_by_stripe_subscription
      return nil if @stripe_subscription_id.blank?

      @organization.subscriptions.find_by(
        stripe_subscription_id: @stripe_subscription_id
      )
    end

    def find_by_checkout_session
      return nil if @stripe_checkout_session_id.blank?

      @organization.subscriptions.find_by(
        stripe_checkout_session_id: @stripe_checkout_session_id
      )
    end
  end
end
