class Users::ConfirmationsController < Devise::ConfirmationsController
  skip_before_action :authenticate_user!, only: [ :new, :create, :show ]
  skip_before_action :require_active_subscription!, only: [ :new, :create, :show ]

  def new
    render inertia: "auth/resend_confirmation", props: {
      errors: {}
    }
  end

  def create
    self.resource = resource_class.send_confirmation_instructions(resource_params)

    if successfully_sent?(resource)
      redirect_to new_user_session_path,
                  notice: "Confirmation instructions have been sent to your email."
    else
      render inertia: "auth/resend_confirmation",
             props: {
               errors: resource.errors.to_hash
             },
             status: :unprocessable_entity
    end
  end

  def show
    self.resource = resource_class.confirm_by_token(params[:confirmation_token])

    if resource.errors.empty?
      redirect_to new_user_session_path,
                  notice: "Email confirmed successfully. You can now sign in."
    else
      redirect_to new_user_confirmation_path,
                  alert: "Confirmation link is invalid or has expired."
    end
  end

  private

  def resource_params
    params.require(:user).permit(:email)
  end
end
