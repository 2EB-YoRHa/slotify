class ErrorsController < InertiaController
  skip_before_action :authenticate_user!

  def not_found
    render_error(
      status: :not_found,
      title: "Page not found",
      description: "The page you are looking for does not exist or is no longer available.",
      action_label: "Go back home",
      action_href: root_path
    )
  end

  def forbidden
    render_error(
      status: :forbidden,
      title: "Access denied",
      description: "You do not have permission to access this area.",
      action_label: "Go back home",
      action_href: root_path
    )
  end

  def unprocessable
    render_error(
      status: :unprocessable_content,
      title: "Request could not be processed",
      description: "The request was valid, but Slotify could not complete the action.",
      action_label: "Go back home",
      action_href: root_path
    )
  end

  def internal_server_error
    render_error(
      status: :internal_server_error,
      title: "Something went wrong",
      description: "Slotify could not complete the request. Please try again or return to the dashboard.",
      action_label: "Go back home",
      action_href: root_path
    )
  end

  private

  def render_error(status:, title:, description:, action_label:, action_href:)
    status_code = Rack::Utils.status_code(status)

    respond_to do |format|
      format.html do
        response.status = status_code

        render inertia: "errors/show",
              props: {
                status: status_code,
                title: title,
                description: description,
                action_label: action_label,
                action_href: action_href
              }
      end

      format.json do
        render json: {
          error: title,
          description: description
        }, status: status
      end

      format.any do
        head status
      end
    end
  end
end
