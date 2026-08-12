class Users::SessionsController < Devise::SessionsController
  skip_before_action :authenticate_user!,
                     only: [
                       :new,
                       :create,
                       :confirmation_required,
                       :inactive_account
                     ]

  skip_before_action :require_active_subscription!,
                     only: [
                       :new,
                       :create,
                       :confirmation_required,
                       :inactive_account
                     ]

  def new
    session[:pending_invitation_token] = params[:invitation_token] if params[:invitation_token].present?

    render inertia: "auth/sign_in", props: {
      invitation_token: session[:pending_invitation_token],
      development_manual_links: pull_development_manual_email_links,
      errors: {}
    }
  end

  def create
    invitation_token = params.dig(:user, :invitation_token)
    session[:pending_invitation_token] = invitation_token if invitation_token.present?

    email = params.dig(:user, :email).to_s.strip.downcase
    password = params.dig(:user, :password).to_s

    user = User.find_for_database_authentication(email: email)

    unless user&.valid_password?(password)
      render inertia: "auth/sign_in",
             props: {
               invitation_token: session[:pending_invitation_token],
               development_manual_links: {},
               errors: {
                 email: "Invalid email or password"
               }
             },
             status: :unprocessable_entity

      return
    end

    if user.inactive_message == :unconfirmed
      session[:confirmation_required_email] = user.email

      redirect_to user_confirmation_required_path
      return
    end

    unless user.active_for_authentication?
      session[:inactive_account] = {
        name: user.name,
        email: user.email,
        organization_name: user.organization&.name
      }

      redirect_to user_inactive_account_path
      return
    end

    sign_in(resource_name, user)

    redirect_to after_sign_in_path_for(user),
                notice: "Signed in successfully"
  end

  def confirmation_required
    user = User.find_by(email: session[:confirmation_required_email].to_s)

    render inertia: "auth/confirmation_required", props: {
      email: session[:confirmation_required_email],
      invitation_token: session[:pending_invitation_token],
      development_manual_links: development_manual_email_links_for(
        user,
        confirmation: true
      ),
      errors: {}
    }
  end

  def inactive_account
    inactive_account = session[:inactive_account] || {}

    render inertia: "auth/inactive_account", props: {
      name: inactive_account["name"],
      email: inactive_account["email"],
      organization_name: inactive_account["organization_name"]
    }
  end
end
