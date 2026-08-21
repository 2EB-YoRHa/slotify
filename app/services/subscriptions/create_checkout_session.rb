module Subscriptions
  class CreateCheckoutSession
    def initialize(organization:, user:, plan_key:, success_url:, cancel_url:)
      @organization = organization
      @user = user
      @plan_key = plan_key
      @success_url = success_url
      @cancel_url = cancel_url
    end

    def call
      raise "Stripe is not configured" if Stripe.api_key.blank?

      plan = SubscriptionPlan.find!(@plan_key)
      price_id = SubscriptionPlan.stripe_price_id(@plan_key)

      raise "Stripe price is not configured for #{plan[:name]}" if price_id.blank?

      customer_id = stripe_customer_id

      Stripe::Checkout::Session.create(
        {
          mode: "subscription",
          customer: customer_id,
          client_reference_id: @organization.id.to_s,
          line_items: [
            {
              price: price_id,
              quantity: 1
            }
          ],
          metadata: {
            organization_id: @organization.id,
            user_id: @user.id,
            plan_key: plan[:key]
          },
          success_url: @success_url,
          cancel_url: @cancel_url
        }
      )
    end

    private

    def stripe_customer_id
      return @organization.stripe_customer_id if @organization.stripe_customer_id.present?

      customer = Stripe::Customer.create(
        {
          email: @organization.email.presence || @user.email,
          name: @organization.name,
          metadata: {
            organization_id: @organization.id
          }
        }
      )

      @organization.update!(
        stripe_customer_id: customer.id
      )

      customer.id
    end
  end
end
