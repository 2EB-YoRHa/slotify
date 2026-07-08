class CreateSubscriptions < ActiveRecord::Migration[8.1]
  def change
    create_table :subscriptions do |t|
      t.references :organization, null: false, foreign_key: true
      t.string :plan_name
      t.string :status
      t.integer :user_limit
      t.integer :workspace_limit
      t.datetime :starts_at
      t.datetime :ends_at

      t.timestamps
    end
  end
end
