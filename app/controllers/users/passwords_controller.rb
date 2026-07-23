class Users::PasswordsController < Devise::PasswordsController
  skip_before_action :authenticate_user!, only: [ :new, :create, :edit, :update ]

  def new
    render inertia: "auth/forgot_password", props: {
      errors: {},
      status: nil
    }
  end

  def create
    self.resource = resource_class.send_reset_password_instructions(resource_params)

    if successfully_sent?(resource)
      render inertia: "auth/forgot_password", props: {
        errors: {},
        status: "Password reset instructions have been sent to your email."
      }
    else
      render inertia: "auth/forgot_password", props: {
        errors: resource.errors.to_hash,
        status: nil
      }, status: :unprocessable_entity
    end
  end

  def edit
    render inertia: "auth/reset_password", props: {
      reset_password_token: params[:reset_password_token],
      errors: {}
    }
  end

  def update
    self.resource = resource_class.reset_password_by_token(password_params)

    if resource.errors.empty?
      unlockable?(resource) ? resource.unlock_access! : nil

      sign_in(resource_name, resource)

      redirect_to root_path, notice: "Password updated successfully"
    else
      render inertia: "auth/reset_password", props: {
        reset_password_token: password_params[:reset_password_token],
        errors: resource.errors.to_hash
      }, status: :unprocessable_entity
    end
  end

  private

  def resource_params
    params.require(:user).permit(:email)
  end

  def password_params
    params.require(:user).permit(
      :reset_password_token,
      :password,
      :password_confirmation
    )
  end
end
