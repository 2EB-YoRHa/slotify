class ApplicationController < ActionController::Base
  allow_browser versions: :modern

  before_action :authenticate_user!

  # Quitar esto (esto es solamente para pruebas).
  skip_forgery_protection if Rails.env.development?

  before_action :authenticate_user!

  helper_method :current_organization, :admin?, :manager?, :member?

  stale_when_importmap_changes

  private

  def current_organization
    current_user&.organization
  end

  def admin?
    current_user&.role&.name == "admin"
  end

  def manager?
    current_user&.role&.name == "manager"
  end

  def member?
    current_user&.role&.name == "member"
  end

  def require_manager_or_admin!
    return if admin? || manager?

    respond_to do |format|
      format.html do
        redirect_to root_path, alert: "You are not authorized to perform this action."
      end

      format.json do
        render json: { error: "Not authorized" }, status: :forbidden
      end
    end
  end
end