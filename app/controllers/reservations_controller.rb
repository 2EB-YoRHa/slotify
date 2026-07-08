class ReservationsController < InertiaController
  before_action :require_manager_or_admin!, only: %i[edit update]
  before_action :set_reservation, only: %i[show edit update destroy]

  def index
    reservations = reservation_scope
                   .includes(:workspace, :user)
                   .order(start_time: :desc)

    serialized_reservations = reservations.as_json(
      include: reservation_includes
    )

    respond_to do |format|
      format.html do
        render inertia: "reservations/index", props: {
          reservations: serialized_reservations
        }
      end

      format.json do
        render json: serialized_reservations
      end
    end
  end

  def show
    serialized_reservation = @reservation.as_json(
      include: reservation_includes
    )

    respond_to do |format|
      format.html do
        render inertia: "reservations/show", props: {
          reservation: serialized_reservation
        }
      end

      format.json do
        render json: serialized_reservation
      end
    end
  end

  def new
    render inertia: "reservations/new", props: {
      workspaces: current_organization.workspaces.where(active: true)
    }
  end

  def create
    result = Reservations::CreateReservation.new(
      user: current_user,
      params: reservation_params
    ).call

    respond_to do |format|
      if result.success?
        format.html do
          redirect_to reservations_path,
                      notice: "Reservation created successfully"
        end

        format.json do
          render json: result.reservation.as_json(
            include: reservation_includes
          ), status: :created
        end
      else
        format.html do
          render inertia: "reservations/new",
                 props: {
                   workspaces: current_organization.workspaces.where(active: true),
                   errors: result.errors
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: result.errors },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def edit
    render inertia: "reservations/edit", props: {
      reservation: @reservation,
      workspaces: current_organization.workspaces.where(active: true)
    }
  end

  def update
    attrs = reservation_params.to_h.symbolize_keys
    workspace_id = attrs.delete(:workspace_id)

    if workspace_id.present?
      workspace = current_organization.workspaces.find_by(
        id: workspace_id,
        active: true
      )

      @reservation.workspace = workspace
      @reservation.errors.add(:workspace, "is invalid") if workspace.blank?
    end

    @reservation.assign_attributes(attrs)

    respond_to do |format|
      if @reservation.errors.blank? && @reservation.save
        format.html do
          redirect_to reservations_path,
                      notice: "Reservation updated successfully"
        end

        format.json do
          render json: @reservation.as_json(include: reservation_includes)
        end
      else
        format.html do
          render inertia: "reservations/edit",
                 props: {
                   reservation: @reservation,
                   workspaces: current_organization.workspaces.where(active: true),
                   errors: @reservation.errors.full_messages
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: @reservation.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    @reservation.status = "cancelled"

    respond_to do |format|
      if @reservation.save
        format.html do
          redirect_to reservations_path,
                      notice: "Reservation cancelled successfully"
        end

        format.json do
          render json: {
            message: "Reservation cancelled successfully",
            reservation: @reservation
          }
        end
      else
        format.html do
          redirect_to reservations_path,
                      alert: "Reservation could not be cancelled"
        end

        format.json do
          render json: { errors: @reservation.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def reservation_scope
    if member?
      current_user.reservations.where(organization: current_organization)
    else
      current_organization.reservations
    end
  end

  def set_reservation
    @reservation = reservation_scope.find(params[:id])
  end

  def reservation_params
    params.require(:reservation).permit(
      :workspace_id,
      :start_time,
      :end_time,
      :status,
      :attendees_count,
      :notes
    )
  end

  def reservation_includes
    {
      workspace: { only: [:id, :name, :workspace_type] },
      user: { only: [:id, :name, :email] }
    }
  end
end