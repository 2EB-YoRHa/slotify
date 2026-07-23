class Users::SessionsController < Devise::SessionsController
  def new
    session[:pending_invitation_token] = params[:invitation_token] if params[:invitation_token].present?

    render inertia: "auth/sign_in", props: {
      invitation_token: session[:pending_invitation_token],
      errors: {}
    }
  end

  def create
    invitation_token = params.dig(:user, :invitation_token)

    session[:pending_invitation_token] = invitation_token if invitation_token.present?

    user = warden.authenticate(auth_options)

    if user
      sign_in(resource_name, user)

      redirect_to after_sign_in_path_for(user),
                  notice: "Signed in successfully"
    else
      render inertia: "auth/sign_in", props: {
        invitation_token: session[:pending_invitation_token],
        errors: {
          email: "Invalid email or password"
        }
      }, status: :unprocessable_entity
    end
  end
end
