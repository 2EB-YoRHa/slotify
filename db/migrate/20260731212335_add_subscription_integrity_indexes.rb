class AddSubscriptionIntegrityIndexes < ActiveRecord::Migration[8.1]
  def change
    unless index_exists?(
      :subscriptions,
      :stripe_subscription_id,
      name: "index_subscriptions_on_unique_stripe_subscription_id"
    )
      add_index :subscriptions,
                :stripe_subscription_id,
                unique: true,
                where: "stripe_subscription_id IS NOT NULL AND stripe_subscription_id <> ''",
                name: "index_subscriptions_on_unique_stripe_subscription_id"
    end

    unless index_exists?(
      :subscriptions,
      :stripe_checkout_session_id,
      name: "index_subscriptions_on_unique_stripe_checkout_session_id"
    )
      add_index :subscriptions,
                :stripe_checkout_session_id,
                unique: true,
                where: "stripe_checkout_session_id IS NOT NULL AND stripe_checkout_session_id <> ''",
                name: "index_subscriptions_on_unique_stripe_checkout_session_id"
    end

    unless index_exists?(
      :subscriptions,
      :organization_id,
      name: "index_subscriptions_one_active_per_organization"
    )
      add_index :subscriptions,
                :organization_id,
                unique: true,
                where: "status IN ('active', 'trialing')",
                name: "index_subscriptions_one_active_per_organization"
    end
  end
end
