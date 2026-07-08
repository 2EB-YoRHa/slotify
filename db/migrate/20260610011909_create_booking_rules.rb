class CreateBookingRules < ActiveRecord::Migration[8.1]
  def change
    create_table :booking_rules do |t|
      t.references :organization, null: false, foreign_key: true
      t.integer :max_hours_per_reservation
      t.integer :min_notice_minutes
      t.integer :cancellation_limit_hours
      t.boolean :allow_weekend_bookings, default: false, null: false

      t.timestamps
    end
  end
end
