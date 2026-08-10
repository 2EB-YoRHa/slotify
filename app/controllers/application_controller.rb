class ApplicationController < ActionController::Base
  include RoleAuthorization

  allow_browser versions: :modern

  before_action :authenticate_user!
  before_action :require_active_subscription!

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

    organization = current_user.organization

    {
      id: current_user.id,
      name: current_user.name,
      email: current_user.email,
      avatar_url: current_user.avatar.attached? ? url_for(current_user.avatar) : nil,
      role: current_user.role&.name,
      organization_id: organization&.id,
      organization_name: organization&.name,
      current_plan: organization&.current_plan,
      billing_required: organization&.billing_required? || false,
      subscription_active: organization&.subscription_active? || false
    }
  }

  def after_sign_in_path_for(_resource)
    invitation_token = session[:pending_invitation_token]

    if invitation_token.present? &&
       OrganizationInvitation.exists?(token: invitation_token, status: "pending")
      accept_organization_invitations_path(token: invitation_token)
    elsif billing_required_after_sign_in?
      subscription_path
    else
      root_path
    end
  end

  def after_sign_out_path_for(_resource_or_scope)
    new_user_session_path
  end

  private

  def require_active_subscription!
    return unless user_signed_in?
    return unless subscription_required_for_user?
    return if subscription_access_allowed?
    return unless current_organization&.billing_required?

    render_subscription_required_response
  end

  def subscription_required_for_user?
    manager? || admin?
  end

  def subscription_access_allowed?
    return true if devise_controller?
    return true if controller_path == "subscriptions"
    return true if controller_path == "profiles"
    return true if controller_path == "errors"
    return true if controller_path.start_with?("users/")
    return true if invitation_acceptance_action?
    return true if request.path == "/up"

    false
  end

  def invitation_acceptance_action?
    controller_path == "organization_invitations" &&
      action_name.in?(%w[accept confirm_accept])
  end

  def billing_required_after_sign_in?
    return false unless current_user&.organization
    return false unless current_user.role&.name.in?(%w[manager admin])

    current_user.organization.billing_required?
  end

  def render_subscription_required_response
    message = "Choose a subscription plan to unlock Slotify."

    respond_to do |format|
      format.html do
        redirect_to subscription_path, alert: message
      end

      format.json do
        render json: {
          error: message,
          code: "billing_required"
        }, status: :payment_required
      end
    end
  end

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
