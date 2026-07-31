namespace :subscriptions do
  desc "Sync local subscriptions with Stripe and optionally cancel duplicate active subscriptions"
  task sync: :environment do
    cancel_duplicates = ActiveModel::Type::Boolean.new.cast(
      ENV["CANCEL_STRIPE_DUPLICATES"]
    )

    organizations = Organization.where.not(
      stripe_customer_id: [
        nil,
        ""
      ]
    )

    if ENV["ORG_ID"].present?
      organizations = organizations.where(id: ENV["ORG_ID"])
    end

    if organizations.blank?
      puts "No organizations with Stripe customer were found."
      next
    end

    organizations.find_each do |organization|
      result = Subscriptions::SyncStripeCustomer.new(
        organization: organization,
        cancel_duplicates: cancel_duplicates
      ).call

      puts [
        "Organization ##{organization.id}",
        organization.name,
        "synced=#{result[:synced_count]}",
        "cancelled_duplicates=#{result[:cancelled_count]}"
      ].join(" | ")
    rescue StandardError => e
      warn [
        "Organization ##{organization.id}",
        organization.name,
        e.class.name,
        e.message
      ].join(" | ")
    end
  end
end
