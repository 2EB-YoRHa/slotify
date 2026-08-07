module Subscriptions
  class ChangeStripeSubscriptionPlan
    def initialize(organization:, plan_key:)
      @organization = organization
      @plan_key = plan_key
    end

    def call
      raise "Stripe is not configured" if Stripe.api_key.blank?

      local_subscription = organization.active_stripe_subscription

      if local_subscription.blank?
        raise "This organization does not have an active Stripe subscription."
      end

      plan = SubscriptionPlan.find!(plan_key)
      price_id = SubscriptionPlan.stripe_price_id(plan_key)

      raise "Stripe price is not configured for #{plan[:name]}" if price_id.blank?

      stripe_subscription = Stripe::Subscription.retrieve(
        local_subscription.stripe_subscription_id
      )

      item_id = first_subscription_item_id(stripe_subscription)

      raise "Stripe subscription item could not be found." if item_id.blank?

      Stripe::Subscription.update(
        local_subscription.stripe_subscription_id,
        {
          items: [
            {
              id: item_id,
              price: price_id
            }
          ],
          proration_behavior: "always_invoice",
          payment_behavior: "pending_if_incomplete",
          metadata: {
            organization_id: organization.id,
            requested_plan_key: plan[:key],
            change_type: "upgrade"
          }
        }
      )
    end

    private

    attr_reader :organization, :plan_key

    def first_subscription_item_id(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash
      items = subscription_hash[:items] || subscription_hash["items"]

      return nil if items.blank?

      data = items[:data] || items["data"]
      first_item = data&.first

      return nil if first_item.blank?

      first_item[:id] || first_item["id"]
    end
  end
end
