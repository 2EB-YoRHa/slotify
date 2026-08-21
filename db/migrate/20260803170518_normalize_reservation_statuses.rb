class NormalizeReservationStatuses < ActiveRecord::Migration[8.1]
  def up
    execute <<~SQL.squish
      UPDATE reservations
      SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP
      WHERE status = 'pending'
    SQL

    execute <<~SQL.squish
      UPDATE reservations
      SET status = 'concluded', updated_at = CURRENT_TIMESTAMP
      WHERE status = 'completed'
    SQL

    execute <<~SQL.squish
      UPDATE reservations
      SET status = 'concluded', updated_at = CURRENT_TIMESTAMP
      WHERE status = 'confirmed'
      AND end_time < CURRENT_TIMESTAMP
    SQL
  end

  def down
    execute <<~SQL.squish
      UPDATE reservations
      SET status = 'confirmed', updated_at = CURRENT_TIMESTAMP
      WHERE status = 'concluded'
    SQL
  end
end
