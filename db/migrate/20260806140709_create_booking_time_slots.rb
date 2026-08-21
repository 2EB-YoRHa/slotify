class CreateBookingTimeSlots < ActiveRecord::Migration[8.0]
  def change
    create_table :booking_time_slots do |t|
      t.references :organization, null: false, foreign_key: true
      t.string :name, null: false
      t.integer :start_minute, null: false
      t.integer :end_minute, null: false
      t.string :days_of_week, null: false, default: "monday,tuesday,wednesday,thursday,friday"
      t.boolean :active, null: false, default: true

      t.timestamps
    end

    add_index :booking_time_slots,
              [ :organization_id, :name ],
              unique: true

    add_index :booking_time_slots,
              [ :organization_id, :active ]
  end
end
