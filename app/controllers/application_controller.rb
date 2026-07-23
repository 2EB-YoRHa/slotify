class ApplicationController < ActionController::Base
  include RoleAuthorization

  allow_browser versions: :modern

  before_action :authenticate_user!

  # TEMPORAL: solo para pruebas con Postman en desarrollo
  skip_forgery_protection if Rails.env.development?

  stale_when_importmap_changes

  def after_sign_in_path_for(resource)
    invitation_token = session[:pending_invitation_token]

    if invitation_token.present? &&
       OrganizationInvitation.exists?(token: invitation_token, status: "pending")
      accept_organization_invitations_path(token: invitation_token)
    else
      root_path
    end
  end

  def after_sign_out_path_for(_resource_or_scope)
    new_user_session_path
  end
end
