module Subscriptions
  class CreatePortalSession
    def initialize(organization:, return_url:)
      @organization = organization
      @return_url = return_url
    end

    def call
      raise "Stripe is not configured" if Stripe.api_key.blank?
      raise "This organization does not have a Stripe customer yet." if @organization.stripe_customer_id.blank?

      Stripe::BillingPortal::Session.create(
        {
          customer: @organization.stripe_customer_id,
          return_url: @return_url
        }
      )
    end
  end
end
