class AddTwoFactorAuthenticationToUsers < ActiveRecord::Migration[8.1]
  def change
    add_column :users, :otp_secret, :string
    add_column :users, :otp_required_for_login, :boolean, null: false, default: false
    add_column :users, :otp_last_used_at, :integer
  end
end
