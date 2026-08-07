module Subscriptions
  class ScheduleStripeSubscriptionDowngrade
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
      target_price_id = SubscriptionPlan.stripe_price_id(plan_key)

      raise "Stripe price is not configured for #{plan[:name]}" if target_price_id.blank?

      stripe_subscription = Stripe::Subscription.retrieve(
        local_subscription.stripe_subscription_id
      )

      current_price_id = stripe_price_id(stripe_subscription)
      current_period_start = stripe_period_start(stripe_subscription)
      current_period_end = stripe_period_end(stripe_subscription)
      quantity = subscription_item_quantity(stripe_subscription)

      raise "Current Stripe price could not be found." if current_price_id.blank?
      raise "Current billing period end could not be found." if current_period_end.blank?

      schedule = subscription_schedule_for(stripe_subscription)

      Stripe::SubscriptionSchedule.update(
        schedule.id,
        {
          end_behavior: "release",
          phases: [
            {
              start_date: current_phase_start(schedule, current_period_start),
              end_date: current_period_end,
              items: [
                {
                  price: current_price_id,
                  quantity: quantity
                }
              ]
            },
            {
              start_date: current_period_end,
              items: [
                {
                  price: target_price_id,
                  quantity: quantity
                }
              ]
            }
          ],
          metadata: {
            organization_id: organization.id,
            requested_plan_key: plan[:key],
            change_type: "scheduled_downgrade"
          }
        }
      )
    end

    private

    attr_reader :organization, :plan_key

    def subscription_schedule_for(stripe_subscription)
      schedule_id = stripe_subscription_schedule_id(stripe_subscription)

      return Stripe::SubscriptionSchedule.retrieve(schedule_id) if schedule_id.present?

      Stripe::SubscriptionSchedule.create(
        from_subscription: stripe_subscription.id
      )
    end

    def stripe_subscription_schedule_id(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash

      subscription_hash[:schedule] || subscription_hash["schedule"]
    end

    def current_phase_start(schedule, fallback_start)
      schedule_hash = schedule.to_hash
      current_phase = schedule_hash[:current_phase] || schedule_hash["current_phase"]

      return fallback_start if current_phase.blank?

      current_phase[:start_date] || current_phase["start_date"] || fallback_start
    end

    def stripe_price_id(stripe_subscription)
      first_subscription_item(stripe_subscription)&.dig(:price, :id) ||
        first_subscription_item(stripe_subscription)&.dig("price", "id")
    end

    def subscription_item_quantity(stripe_subscription)
      first_subscription_item(stripe_subscription)&.dig(:quantity) ||
        first_subscription_item(stripe_subscription)&.dig("quantity") ||
        1
    end

    def first_subscription_item(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash
      items = subscription_hash[:items] || subscription_hash["items"]

      return nil if items.blank?

      data = items[:data] || items["data"]

      data&.first
    end

    def stripe_period_start(stripe_subscription)
      subscription_hash = stripe_subscription.to_hash

      timestamp =
        subscription_hash[:current_period_start] ||
        subscription_hash["current_period_start"]

      timestamp.to_i if timestamp.present?
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

      timestamp.to_i if timestamp.present?
    end
  end
end
