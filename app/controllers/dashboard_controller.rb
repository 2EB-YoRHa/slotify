class DashboardController < InertiaController
  def index
    organization = current_organization

    unless organization
      render inertia: "dashboard/index", props: empty_dashboard_props
      return
    end

    if member?
      render inertia: "dashboard/index", props: member_dashboard_props(organization)
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
      current_plan: organization.current_plan,
      plan_entitlements: organization.plan_entitlements,
      stats: dashboard_stats(
        organization,
        reservations,
        active_workspace_count,
        occupied_workspace_count,
        available_workspace_count,
        occupancy_rate
      ),
      upcoming_reservations: serialize_reservations(upcoming_reservations),
      recent_activities: recent_activities(organization),
      weekly_occupancy: organization.usage_insights_enabled? ? weekly_occupancy(organization) : [],
      workspace_distribution: organization.usage_insights_enabled? ? workspace_distribution(organization) : [],
      availability_command_center: organization.availability_command_center_enabled? ? availability_command_center_summary(
        organization,
        active_workspace_count,
        occupied_workspace_count,
        available_workspace_count,
        occupancy_rate,
        upcoming_reservations.first
      ) : nil
    }
  end

  private

  def empty_dashboard_props
    {
      current_user: current_user.as_json(only: [ :id, :name, :email ]),
      organization_name: nil,
      current_plan: "billing_required",
      plan_entitlements: SubscriptionPlan::BILLING_REQUIRED_ENTITLEMENTS,
      stats: [],
      upcoming_reservations: [],
      recent_activities: [],
      weekly_occupancy: [],
      workspace_distribution: [],
      availability_command_center: nil,
      member_dashboard: false,
      member_next_reservation: nil,
      member_upcoming_reservations: []
    }
  end

  def dashboard_stats(
    organization,
    reservations,
    active_workspace_count,
    occupied_workspace_count,
    available_workspace_count,
    occupancy_rate
  )
    [
      {
        label: "Total Reservations",
        value: reservations.count,
        helper: "#{reservations.where(start_time: Time.current.all_month).count} this month"
      },
      {
        label: "Current Occupancy",
        value: "#{occupancy_rate}%",
        helper: "#{occupied_workspace_count} of #{active_workspace_count} active spaces in use"
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
    ]
  end

  def calculate_percentage(value, total)
    return 0 if total.zero?

    ((value.to_f / total) * 100).round(1)
  end

  def serialize_reservations(reservations)
    reservations.map do |reservation|
      serialize_reservation(reservation)
    end
  end

  def serialize_reservation(reservation)
    ReservationSerializer
      .new(reservation, view_context: view_context)
      .as_json
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
    when "concluded"
      "#{user_name} completed #{workspace_name}"
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

  def availability_command_center_summary(
    organization,
    active_workspace_count,
    occupied_workspace_count,
    available_workspace_count,
    occupancy_rate,
    next_reservation
  )
    {
      active_workspace_count: active_workspace_count,
      occupied_workspace_count: occupied_workspace_count,
      available_workspace_count: available_workspace_count,
      occupancy_rate: occupancy_rate,
      busiest_workspace: busiest_workspace_this_month(organization),
      next_reservation: next_reservation.present? ? serialize_reservations([ next_reservation ]).first : nil
    }
  end

  def busiest_workspace_this_month(organization)
    workspace_id, reservation_count = organization.reservations
      .where.not(status: "cancelled")
      .where(start_time: Time.current.all_month)
      .group(:workspace_id)
      .count
      .max_by { |_workspace_id, count| count }

    return nil if workspace_id.blank?

    workspace = organization.workspaces.find_by(id: workspace_id)

    return nil if workspace.blank?

    {
      id: workspace.id,
      name: workspace.name,
      reservation_count: reservation_count
    }
  end

  def format_workspace_type(workspace_type)
    workspace_type.to_s
                  .tr("_", " ")
                  .split
                  .map(&:capitalize)
                  .join(" ")
  end

  def member_dashboard_props(organization)
  current_time = Time.current

  reservations = current_user
    .reservations
    .where(organization: organization)

  active_reservations = reservations.where.not(status: "cancelled")

  upcoming_reservations = active_reservations
    .includes(workspace: [ :amenities, { photo_attachment: :blob } ])
    .where("start_time >= ?", current_time)
    .order(start_time: :asc)
    .limit(3)

  next_reservation = upcoming_reservations.first

  {
    current_user: current_user.as_json(
      only: [ :id, :name, :email ]
    ).merge(
      role: current_user.role&.name
    ),
    organization_name: organization.name,
    current_plan: organization.current_plan,
    plan_entitlements: organization.plan_entitlements,
    stats: member_dashboard_stats(reservations, current_time),
    upcoming_reservations: [],
    recent_activities: [],
    weekly_occupancy: [],
    workspace_distribution: [],
    availability_command_center: nil,
    member_dashboard: true,
    member_next_reservation: next_reservation.present? ? serialize_reservation(next_reservation) : nil,
    member_upcoming_reservations: serialize_reservations(upcoming_reservations)
  }
  end

  def member_dashboard_stats(reservations, current_time)
    active_reservations = reservations.where.not(status: "cancelled")

    [
      {
        label: "Upcoming",
        value: active_reservations.where("start_time >= ?", current_time).count,
        helper: "Confirmed future bookings"
      },
      {
        label: "Active Now",
        value: active_reservations.where(
          "start_time <= ? AND end_time >= ?",
          current_time,
          current_time
        ).count,
        helper: "Bookings currently in progress"
      },
      {
        label: "Completed",
        value: active_reservations.where("end_time < ?", current_time).count,
        helper: "Past completed bookings"
      },
      {
        label: "Cancelled",
        value: reservations.where(status: "cancelled").count,
        helper: "Cancelled bookings"
      }
    ]
  end
end
