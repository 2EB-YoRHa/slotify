class DashboardController < InertiaController
  def index
    organization = current_user.organization

    upcoming_reservations = organization
      .reservations
      .includes(:workspace, :user)
      .where.not(status: "cancelled")
      .where("start_time >= ?", Time.current)
      .order(start_time: :asc)
      .limit(5)

    render inertia: "dashboard/index", props: {
      total_workspaces: organization.workspaces.count,
      total_reservations: organization.reservations.count,
      upcoming_reservations: upcoming_reservations.as_json(
        include: {
          workspace: { only: [:id, :name, :workspace_type] },
          user: { only: [:id, :name, :email] }
        }
      )
    }
  end
end