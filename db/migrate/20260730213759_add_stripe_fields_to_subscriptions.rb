class AddStripeFieldsToSubscriptions < ActiveRecord::Migration[8.1]
  def change
    add_column :subscriptions, :stripe_subscription_id, :string
    add_column :subscriptions, :stripe_price_id, :string
    add_column :subscriptions, :stripe_checkout_session_id, :string
  end
end
