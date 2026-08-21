class PasswordSettingsController < ApplicationController
  def update
    unless current_user.valid_password?(password_settings_params[:current_password].to_s)
      render_security_error(current_password: "Current password is incorrect.")
      return
    end

    current_user.assign_attributes(
      password: password_settings_params[:password],
      password_confirmation: password_settings_params[:password_confirmation]
    )

    if current_user.save
      bypass_sign_in(current_user)

      redirect_to security_path,
                  notice: "Password updated successfully."
    else
      render_security_error(current_user.errors.to_hash)
    end
  end

  private

  def password_settings_params
    params.require(:user).permit(
      :current_password,
      :password,
      :password_confirmation
    )
  end

  def render_security_error(errors)
    current_user.ensure_otp_secret! unless current_user.two_factor_enabled?

    render inertia: "two_factor/show",
           props: {
             two_factor: serialized_two_factor_settings,
             password_errors: errors,
             two_factor_errors: {}
           },
           status: :unprocessable_entity
  end

  def serialized_two_factor_settings
    {
      enabled: current_user.two_factor_enabled?,
      setup_key: current_user.two_factor_enabled? ? nil : current_user.otp_secret,
      provisioning_uri: nil,
      account_label: current_user.email,
      issuer: "Slotify"
    }
  end
end
