class CreateWorkspaces < ActiveRecord::Migration[8.1]
  def change
    create_table :workspaces do |t|
      t.references :organization, null: false, foreign_key: true
      t.string :name
      t.string :workspace_type
      t.integer :capacity
      t.string :floor
      t.string :zone
      t.string :location
      t.text :description
      t.decimal :hourly_rate
      t.boolean :active, default: true, null: false

      t.timestamps
    end
  end
end
