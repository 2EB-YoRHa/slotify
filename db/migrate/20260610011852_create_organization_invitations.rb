class CreateOrganizationInvitations < ActiveRecord::Migration[8.1]
  def change
    create_table :organization_invitations do |t|
      t.references :organization, null: false, foreign_key: true
t.references :invited_by, null: false, foreign_key: { to_table: :users }
      t.references :role, null: false, foreign_key: true
      t.string :email
      t.string :token
      t.string :status
      t.datetime :expires_at
      t.datetime :accepted_at

      t.timestamps
    end
  end
end
