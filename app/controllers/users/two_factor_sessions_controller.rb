class Users::TwoFactorSessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!, only: [ :new, :create ]
  skip_before_action :require_active_subscription!, only: [ :new, :create ]

  def new
    user = pending_two_factor_user

    unless user
      redirect_to new_user_session_path,
                  alert: "Please sign in first."
      return
    end

    render inertia: "auth/two_factor_challenge", props: {
      email: user.email,
      errors: {}
    }
  end

  def create
    user = pending_two_factor_user

    unless user
      redirect_to new_user_session_path,
                  alert: "Please sign in first."
      return
    end

    code = params.dig(:two_factor, :code)

    unless user.verify_otp(code)
      render inertia: "auth/two_factor_challenge",
             props: {
               email: user.email,
               errors: {
                 code: "Enter a valid 6-digit authenticator code."
               }
             },
             status: :unprocessable_entity

      return
    end

    session.delete(:pending_two_factor_user_id)

    sign_in(resource_name, user)

    redirect_to after_sign_in_path_for(user),
                notice: "Signed in successfully."
  end

  private

  def pending_two_factor_user
    User.find_by(id: session[:pending_two_factor_user_id])
  end
end
