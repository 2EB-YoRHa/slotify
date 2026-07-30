class AddStripeCustomerIdToOrganizations < ActiveRecord::Migration[8.1]
  def change
    add_column :organizations, :stripe_customer_id, :string
  end
end
