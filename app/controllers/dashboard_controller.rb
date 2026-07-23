class DashboardController < InertiaController
  def index
    organization = current_organization

    unless organization
      render inertia: "dashboard/index", props: empty_dashboard_props
      return
    end

    workspaces = organization.workspaces
    active_workspaces = workspaces.where(active: true)
    reservations = organization.reservations
    active_reservations = reservations.where.not(status: "cancelled")

    current_time = Time.current

    occupied_workspace_ids = active_reservations
      .where("start_time <= ? AND end_time >= ?", current_time, current_time)
      .pluck(:workspace_id)
      .uniq

    active_workspace_count = active_workspaces.count
    occupied_workspace_count = occupied_workspace_ids.count

    available_workspace_count = active_workspaces
      .where.not(id: occupied_workspace_ids)
      .count

    occupancy_rate = calculate_percentage(
      occupied_workspace_count,
      active_workspace_count
    )

    upcoming_reservations = active_reservations
      .includes(:workspace, :user)
      .where("start_time >= ?", current_time)
      .order(start_time: :asc)
      .limit(5)

    render inertia: "dashboard/index", props: {
      current_user: current_user.as_json(
        only: [ :id, :name, :email ]
      ).merge(
        role: current_user.role&.name
      ),
      organization_name: organization.name,
      stats: [
        {
          label: "Total Reservations",
          value: reservations.count,
          helper: "#{reservations.where(start_time: Time.current.all_month).count} this month"
        },
        {
          label: "Occupancy Rate",
          value: "#{occupancy_rate}%",
          helper: "#{occupied_workspace_count} spaces in use now"
        },
        {
          label: "Available Spaces",
          value: available_workspace_count,
          helper: "#{active_workspace_count} active spaces"
        },
        {
          label: "Active Users",
          value: organization.users.where(active: true).count,
          helper: "#{organization.organization_invitations.where(status: "pending").count} pending invites"
        }
      ],
      upcoming_reservations: upcoming_reservations.as_json(
        only: [ :id, :start_time, :end_time, :status, :attendees_count ],
        include: {
          workspace: { only: [ :id, :name, :workspace_type, :location ] },
          user: { only: [ :id, :name, :email ] }
        }
      ),
      recent_activities: recent_activities(organization),
      weekly_occupancy: weekly_occupancy(organization),
      workspace_distribution: workspace_distribution(organization)
    }
  end

  private

  def empty_dashboard_props
    {
      current_user: current_user.as_json(only: [ :id, :name, :email ]),
      organization_name: nil,
      stats: [],
      upcoming_reservations: [],
      recent_activities: [],
      weekly_occupancy: [],
      workspace_distribution: []
    }
  end

  def calculate_percentage(value, total)
    return 0 if total.zero?

    ((value.to_f / total) * 100).round(1)
  end

  def recent_activities(organization)
    organization.reservations
      .includes(:workspace, :user)
      .order(updated_at: :desc)
      .limit(5)
      .map do |reservation|
        {
          id: reservation.id,
          text: activity_text(reservation),
          occurred_at: reservation.updated_at
        }
      end
  end

  def activity_text(reservation)
    user_name = reservation.user&.name || "Unknown user"
    workspace_name = reservation.workspace&.name || "Workspace removed"

    case reservation.status
    when "cancelled"
      "#{user_name} cancelled #{workspace_name}"
    when "confirmed"
      "#{user_name} booked #{workspace_name}"
    when "pending"
      "#{user_name} requested #{workspace_name}"
    else
      "#{user_name} updated #{workspace_name}"
    end
  end

  def weekly_occupancy(organization)
    week_start = Time.current.beginning_of_week

    days = (0..6).map do |index|
      day = week_start + index.days

      {
        label: day.strftime("%a"),
        count: organization.reservations
                           .where.not(status: "cancelled")
                           .where(start_time: day.all_day)
                           .count
      }
    end

    max_count = days.map { |day| day[:count] }.max.to_i

    days.map do |day|
      percentage = max_count.zero? ? 0 : calculate_percentage(day[:count], max_count)

      day.merge(percentage: percentage)
    end
  end

  def workspace_distribution(organization)
    grouped_workspaces = organization.workspaces
      .group(:workspace_type)
      .count

    total_workspaces = grouped_workspaces.values.sum

    grouped_workspaces.map do |workspace_type, count|
      {
        label: format_workspace_type(workspace_type),
        count: count,
        percentage: calculate_percentage(count, total_workspaces)
      }
    end
  end

  def format_workspace_type(workspace_type)
    workspace_type.to_s
                  .tr("_", " ")
                  .split
                  .map(&:capitalize)
                  .join(" ")
  end
end
