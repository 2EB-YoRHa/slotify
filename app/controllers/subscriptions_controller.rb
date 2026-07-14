class SubscriptionsController < InertiaController
  before_action :require_manager_or_admin!

  def show
    subscription = current_organization.subscriptions
                                       .order(created_at: :desc)
                                       .first

    render inertia: "subscriptions/show", props: {
      organization: current_organization.as_json(
        only: [:id, :name, :slug, :email, :phone, :address]
      ),
      subscription: subscription
    }
  end
end