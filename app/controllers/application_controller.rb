class ApplicationController < ActionController::Base
  include RoleAuthorization

  allow_browser versions: :modern

  before_action :authenticate_user!

  rescue_from ActionController::InvalidAuthenticityToken,
              with: :handle_invalid_authenticity_token

  stale_when_importmap_changes

  inertia_share flash: -> {
    {
      notice: flash.notice,
      alert: flash.alert
    }
  }

  inertia_share current_user: -> {
    next nil unless user_signed_in?

    {
      id: current_user.id,
      name: current_user.name,
      email: current_user.email,
      role: current_user.role&.name
    }
  }

  def after_sign_in_path_for(_resource)
    invitation_token = session[:pending_invitation_token]

    if invitation_token.present? &&
       OrganizationInvitation.exists?(token: invitation_token, status: "pending")
      accept_organization_invitations_path(token: invitation_token)
    elsif current_user&.role&.name == "member"
      workspaces_path
    else
      root_path
    end
  end

  def after_sign_out_path_for(_resource_or_scope)
    new_user_session_path
  end

  private

  def handle_invalid_authenticity_token
    reset_session

    redirect_to new_user_session_path,
                alert: "Your session expired. Please sign in again."
  end
end
