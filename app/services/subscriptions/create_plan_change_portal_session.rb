module Subscriptions
  class CreatePlanChangePortalSession
    def initialize(organization:, plan_key:, return_url:)
      @organization = organization
      @plan_key = plan_key
      @return_url = return_url
    end

    def call
      raise "Stripe is not configured" if Stripe.api_key.blank?

      if organization.stripe_customer_id.blank?
        raise "This organization does not have a Stripe customer yet."
      end

      local_subscription = organization.active_stripe_subscription

      if local_subscription.blank?
        raise "This organization does not have an active Stripe subscription."
      end

      plan = SubscriptionPlan.find!(plan_key)
      target_price_id = SubscriptionPlan.stripe_price_id(plan_key)

      if target_price_id.blank?
        raise "Stripe price is not configured for #{plan[:name]}"
      end

      stripe_subscription = Stripe::Subscription.retrieve(
        local_subscription.stripe_subscription_id
      )

      subscription_item = first_subscription_item(stripe_subscription)

      if subscription_item.blank?
        raise "Stripe subscription item could not be found."
      end

      current_price_id = subscription_item_price_id(subscription_item)

      if current_price_id == target_price_id
        raise "Stripe already has #{plan[:name]} as the active plan. Refresh Subscription to sync Slotify."
      end

      Stripe::BillingPortal::Session.create(
        portal_session_params(
          stripe_subscription: stripe_subscription,
          subscription_item: subscription_item,
          target_price_id: target_price_id
        )
      )
    end

    private

    attr_reader :organization, :plan_key, :return_url

    def portal_session_params(
      stripe_subscription:,
      subscription_item:,
      target_price_id:
    )
      params = {
        customer: organization.stripe_customer_id,
        return_url: return_url,
        flow_data: {
          type: "subscription_update_confirm",
          subscription_update_confirm: {
            subscription: stripe_subscription.id,
            items: [
              {
                id: subscription_item_id(subscription_item),
                price: target_price_id,
                quantity: subscription_item_quantity(subscription_item)
              }
            ]
          },
          after_completion: {
            type: "redirect",
            redirect: {
              return_url: return_url
            }
          }
        }
      }

      if ENV["STRIPE_PLAN_CHANGE_PORTAL_CONFIGURATION_ID"].present?
        params[:configuration] = ENV["STRIPE_PLAN_CHANGE_PORTAL_CONFIGURATION_ID"]
      end

      params
    end

    def first_subscription_item(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash
      items = subscription_hash[:items] || subscription_hash["items"]

      return nil if items.blank?

      data = items[:data] || items["data"]

      data&.first
    end

    def subscription_item_id(subscription_item)
      subscription_item[:id] || subscription_item["id"]
    end

    def subscription_item_quantity(subscription_item)
      subscription_item[:quantity] || subscription_item["quantity"] || 1
    end

    def subscription_item_price_id(subscription_item)
      price = subscription_item[:price] || subscription_item["price"]

      return nil if price.blank?

      price[:id] || price["id"]
    end
  end
end
