class DashboardController < InertiaController
  def index
    organization = current_user.organization

    render inertia: "dashboard/index", props: {
      total_workspaces: organization&.workspaces&.count || 0,
      total_reservations: organization&.reservations&.count || 0,
      upcoming_reservations: organization&.reservations&.includes(:workspace, :user)&.order(start_time: :asc)&.limit(5)&.as_json(
        include: {
          workspace: { only: [:id, :name, :workspace_type] },
          user: { only: [:id, :name, :email] }
        }
      ) || []
    }
  end
end