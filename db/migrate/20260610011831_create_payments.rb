class CreatePayments < ActiveRecord::Migration[8.1]
  def change
    create_table :payments do |t|
      t.references :subscription, null: false, foreign_key: true
      t.decimal :amount
      t.string :currency
      t.string :status
      t.string :payment_provider
      t.string :provider_payment_id
      t.datetime :paid_at

      t.timestamps
    end
  end
end
