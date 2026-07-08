module RoleAuthorization
  extend ActiveSupport::Concern

  included do
    helper_method :current_organization, :admin?, :manager?, :member?
  end

  private

  def current_organization
    current_user&.organization
  end

  def role_name
    current_user&.role&.name
  end

  def admin?
    role_name == "admin"
  end

  def manager?
    role_name == "manager"
  end

  def member?
    role_name == "member"
  end

  def require_admin!
    return if admin?

    deny_access
  end

  def require_manager_or_admin!
    return if admin? || manager?

    deny_access
  end

  def deny_access
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