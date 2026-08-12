class TwoFactorSettingsController < ApplicationController
  def show
    current_user.ensure_otp_secret! unless current_user.two_factor_enabled?

    render inertia: "two_factor/show", props: {
      two_factor: serialized_two_factor_settings,
      password_errors: {},
      two_factor_errors: {}
    }
  end

  def prepare
    current_user.ensure_otp_secret!

    redirect_to security_path,
                notice: "Two-factor setup is ready."
  end

  def enable
    current_user.ensure_otp_secret!

    unless current_user.valid_password?(two_factor_params[:current_password].to_s)
      render_two_factor_error(current_password: "Current password is incorrect.")
      return
    end

    unless current_user.verify_otp(two_factor_params[:code])
      render_two_factor_error(code: "Enter a valid 6-digit authenticator code.")
      return
    end

    current_user.enable_two_factor!

    redirect_to security_path,
                notice: "Two-factor authentication was enabled successfully."
  end

  def destroy
    unless current_user.two_factor_enabled?
      redirect_to security_path,
                  alert: "Two-factor authentication is not enabled."
      return
    end

    unless current_user.valid_password?(two_factor_params[:current_password].to_s)
      render_two_factor_error(current_password: "Current password is incorrect.")
      return
    end

    unless current_user.verify_otp(two_factor_params[:code])
      render_two_factor_error(code: "Enter a valid 6-digit authenticator code.")
      return
    end

    current_user.disable_two_factor!

    redirect_to security_path,
                notice: "Two-factor authentication was disabled successfully."
  end

  private

  def two_factor_params
    params
      .fetch(:two_factor, {})
      .permit(:code, :current_password)
  end

  def render_two_factor_error(errors)
    current_user.ensure_otp_secret! unless current_user.two_factor_enabled?

    render inertia: "two_factor/show",
           props: {
             two_factor: serialized_two_factor_settings,
             password_errors: {},
             two_factor_errors: errors
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
