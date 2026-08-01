class ApplicationController < ActionController::Base
  include RoleAuthorization

  allow_browser versions: :modern

  before_action :authenticate_user!

  rescue_from ActionController::InvalidAuthenticityToken,
              with: :handle_invalid_authenticity_token

  rescue_from ActiveRecord::RecordNotFound,
              with: :handle_record_not_found

  rescue_from ActionController::ParameterMissing,
              with: :handle_bad_request

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

  def handle_record_not_found
    response.status = :not_found

    render inertia: "errors/show",
          props: {
            status: 404,
            title: "Record not found",
            description: "The item you are trying to open does not exist or is no longer available.",
            action_label: "Go back home",
            action_href: root_path
          }
  end

  def handle_bad_request(error)
    response.status = :bad_request

    render inertia: "errors/show",
          props: {
            status: 400,
            title: "Invalid request",
            description: error.message,
            action_label: "Go back home",
            action_href: root_path
          }
  end
end
