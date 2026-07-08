class ApplicationController < ActionController::Base
  include RoleAuthorization

  allow_browser versions: :modern

  before_action :authenticate_user!

  # TEMPORAL: solo para pruebas con Postman en desarrollo
  skip_forgery_protection if Rails.env.development?

  stale_when_importmap_changes
end