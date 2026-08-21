class OrganizationMembersController < InertiaController
  before_action :require_manager_or_admin!
  before_action :set_member

  def show
    reservations = @member.reservations
                          .includes(:workspace)
                          .order(start_time: :desc)
                          .limit(10)

    render inertia: "organization_members/show", props: {
      member: serialized_member(@member),
      reservations: reservations.map { |reservation| serialized_reservation(reservation) },
      reservation_count: @member.reservations.count,
      can_toggle_access: @member != current_user
    }
  end

  def toggle_active
    if @member == current_user
      redirect_to organization_member_path(@member),
                  alert: "You cannot deactivate your own account."
      return
    end

    @member.update!(active: !@member.active)

    message = @member.active ? "Member activated successfully." : "Member deactivated successfully."

    redirect_to organization_member_path(@member),
                notice: message
  end

  private

  def set_member
    @member = current_organization.users
                                  .includes(:role)
                                  .find(params[:id])
  end

  def serialized_member(member)
    member.as_json(
      only: [ :id, :name, :email, :active, :created_at ],
      include: {
        role: { only: [ :id, :name ] }
      }
    )
  end

  def serialized_reservation(reservation)
    {
      id: reservation.id,
      workspace_name: reservation.workspace&.name || "Workspace removed",
      start_time: reservation.start_time,
      end_time: reservation.end_time,
      status: reservation.status
    }
  end
end
