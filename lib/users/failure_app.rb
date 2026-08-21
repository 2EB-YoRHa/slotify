module Users
  class FailureApp < Devise::FailureApp
    def respond
      if inertia_request? || html_request?
        redirect
      else
        super
      end
    end

    def redirect_url
      new_user_session_path
    end

    def redirect
      store_location!
      flash[:alert] = friendly_message if is_flashing_format?
      redirect_to redirect_url
    end

    private

    def inertia_request?
      request.headers["X-Inertia"].present?
    end

    def html_request?
      request.format.html?
    rescue StandardError
      false
    end

    def friendly_message
      case warden_message
      when :unconfirmed
        "Please confirm your email address before signing in."
      when :inactive
        "Your account is not active. Please contact your organization administrator."
      else
        i18n_message
      end
    end
  end
end
