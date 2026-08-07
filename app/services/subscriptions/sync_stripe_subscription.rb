module Subscriptions
  class SyncStripeSubscription
    def initialize(organization:)
      @organization = organization
    end

    def call
      raise "Stripe is not configured" if Stripe.api_key.blank?

      local_subscription = organization.active_stripe_subscription

      return organization.active_subscription if local_subscription.blank?

      stripe_subscription = Stripe::Subscription.retrieve(
        local_subscription.stripe_subscription_id
      )

      stripe_price_id = subscription_price_id(stripe_subscription)
      plan_key = SubscriptionPlan.plan_key_for_price_id(stripe_price_id)

      return local_subscription if plan_key.blank?

      Subscriptions::ApplyStripeSubscription.new(
        organization: organization,
        plan_key: plan_key,
        status: subscription_status(stripe_subscription),
        stripe_subscription_id: stripe_subscription.id,
        stripe_price_id: stripe_price_id,
        stripe_checkout_session_id: local_subscription.stripe_checkout_session_id,
        ends_at: stripe_period_end(stripe_subscription)
      ).call
    end

    private

    attr_reader :organization

    def subscription_price_id(stripe_subscription)
      first_item = first_subscription_item(stripe_subscription)

      return nil if first_item.blank?

      price = first_item[:price] || first_item["price"]

      return nil if price.blank?

      price[:id] || price["id"]
    end

    def subscription_status(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash

      subscription_hash[:status] || subscription_hash["status"] || "active"
    end

    def first_subscription_item(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash
      items = subscription_hash[:items] || subscription_hash["items"]

      return nil if items.blank?

      data = items[:data] || items["data"]

      data&.first
    end

    def stripe_period_end(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash

      timestamp =
        subscription_hash[:current_period_end] ||
        subscription_hash["current_period_end"]

      if timestamp.blank?
        first_item = first_subscription_item(stripe_subscription)

        timestamp =
          first_item&.dig(:current_period_end) ||
          first_item&.dig("current_period_end")
      end

      return nil if timestamp.blank?

      Time.zone.at(timestamp.to_i)
    end
  end
end
