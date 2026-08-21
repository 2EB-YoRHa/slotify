module Subscriptions
  class SyncStripeCustomer
    ACTIVE_STATUSES = %w[active trialing].freeze

    def initialize(organization:, cancel_duplicates: false)
      @organization = organization
      @cancel_duplicates = cancel_duplicates
      @cancelled_count = 0
      @synced_count = 0
    end

    def call
      raise "Stripe is not configured" if Stripe.api_key.blank?
      raise "Organization does not have a Stripe customer" if organization.stripe_customer_id.blank?

      stripe_subscriptions = fetch_stripe_subscriptions

      if cancel_duplicates
        cancel_duplicate_active_subscriptions(stripe_subscriptions)
        stripe_subscriptions = fetch_stripe_subscriptions
      end

      stripe_subscriptions.each do |stripe_subscription|
        sync_subscription(stripe_subscription)
      end

      clean_local_duplicate_active_subscriptions if cancel_duplicates

      {
        synced_count: synced_count,
        cancelled_count: cancelled_count
      }
    end

    private

    attr_reader :organization,
                :cancel_duplicates,
                :cancelled_count,
                :synced_count

    def fetch_stripe_subscriptions
      Stripe::Subscription
        .list(
          customer: organization.stripe_customer_id,
          status: "all",
          limit: 100
        )
        .data
    end

    def cancel_duplicate_active_subscriptions(stripe_subscriptions)
      active_subscriptions = stripe_subscriptions
                             .select { |subscription| active?(subscription) }
                             .select { |subscription| recognized_plan?(subscription) }
                             .sort_by { |subscription| stripe_created_at(subscription) || Time.zone.at(0) }
                             .reverse

      active_subscriptions.drop(1).each do |subscription|
        Stripe::Subscription.cancel(subscription.id)
        @cancelled_count += 1
      rescue Stripe::StripeError => e
        Rails.logger.warn(
          "Could not cancel duplicate Stripe subscription #{subscription.id}: #{e.message}"
        )
      end
    end

    def sync_subscription(stripe_subscription)
      price_id = stripe_price_id(stripe_subscription)
      plan_key = SubscriptionPlan.plan_key_for_price_id(price_id)

      return if plan_key.blank?

      subscription = organization.subscriptions.find_or_initialize_by(
        stripe_subscription_id: stripe_subscription.id
      )

      SubscriptionPlan.apply_to!(
        subscription,
        plan_key: plan_key,
        status: stripe_status(stripe_subscription),
        stripe_subscription_id: stripe_subscription.id,
        stripe_price_id: price_id,
        stripe_checkout_session_id: subscription.stripe_checkout_session_id,
        ends_at: stripe_period_end(stripe_subscription)
      )

      @synced_count += 1
    end

    def clean_local_duplicate_active_subscriptions
      active_local_subscriptions = organization
                                   .subscriptions
                                   .where(status: ACTIVE_STATUSES)
                                   .order(created_at: :desc)
                                   .to_a

      active_local_subscriptions.drop(1).each do |subscription|
        subscription.update!(
          status: "cancelled",
          ends_at: Time.current
        )
      end
    end

    def active?(stripe_subscription)
      ACTIVE_STATUSES.include?(stripe_status(stripe_subscription))
    end

    def recognized_plan?(stripe_subscription)
      SubscriptionPlan.plan_key_for_price_id(
        stripe_price_id(stripe_subscription)
      ).present?
    end

    def stripe_status(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash

      subscription_hash[:status] || subscription_hash["status"]
    end

    def stripe_created_at(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash
      timestamp = subscription_hash[:created] || subscription_hash["created"]

      return nil if timestamp.blank?

      Time.zone.at(timestamp.to_i)
    end

    def stripe_price_id(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash
      items = subscription_hash[:items] || subscription_hash["items"]

      return nil if items.blank?

      data = items[:data] || items["data"]
      first_item = data&.first

      return nil if first_item.blank?

      price = first_item[:price] || first_item["price"]

      return nil if price.blank?

      price[:id] || price["id"]
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
end
