class ReservationsController < InertiaController
  before_action :set_reservation, only: %i[show edit update destroy cancel_confirmation]

  before_action :ensure_reservation_can_be_modified,
              only: %i[edit update destroy cancel_confirmation]

  def index
    reservations = reservation_scope
                   .includes(:user, workspace: [ :amenities, { photo_attachment: :blob } ])
                   .order(start_time: :desc)

    serialized_reservations = serialize_reservations(reservations)

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
    serialized_reservation = serialize_reservation(@reservation)

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
    default_start_time = Time.zone.parse("#{Time.zone.today} 09:00")
    default_end_time = Time.zone.parse("#{Time.zone.today} 10:00")

      render inertia: "reservations/new", props: {
        workspaces: serialize_workspaces(active_workspaces),
        selected_workspace_id: params[:workspace_id],
        initial_start_time: default_start_time.strftime("%Y-%m-%dT%H:%M"),
        initial_end_time: default_end_time.strftime("%Y-%m-%dT%H:%M"),
        initial_unavailable_workspace_ids: unavailable_workspace_ids_for(
          default_start_time,
          default_end_time
        ),
        booking_rule: current_organization.booking_rule,
        booking_time_slots: reservation_time_slots
      }
  end

  def create
    result = Reservations::CreateReservation
             .new(user: current_user, params: reservation_params)
             .call

    respond_to do |format|
      if result.success?
        format.html do
          redirect_to my_reservations_path,
                      notice: "Reservation created successfully"
        end

        format.json do
          render json: serialize_reservation(result.reservation),
                 status: :created
        end
      else
        format.html do
          render inertia: "reservations/new",
                 props: {
                   workspaces: serialize_workspaces(active_workspaces),
                   selected_workspace_id: reservation_params[:workspace_id],
                   initial_start_time: reservation_params[:start_time],
                   initial_end_time: reservation_params[:end_time],
                   initial_unavailable_workspace_ids: unavailable_workspace_ids_from_params,
                   errors: {
                     base: result.errors
                   },
                   booking_rule: current_organization.booking_rule,
                   booking_time_slots: reservation_time_slots
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: result.errors
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def edit
    render inertia: "reservations/edit", props: {
        reservation: serialize_reservation(@reservation),
        workspaces: serialize_workspaces(editable_workspaces),
        booking_rule: current_organization.booking_rule,
        booking_time_slots: reservation_time_slots,
        can_manage_status: admin? || manager?,
        initial_unavailable_workspace_ids: initial_unavailable_workspace_ids_for(@reservation)
      }
  end

  def update
    attrs = reservation_params.to_h.symbolize_keys
    workspace_id = attrs.delete(:workspace_id)

    assign_workspace(workspace_id) if workspace_id.present?
    @reservation.assign_attributes(attrs)

    respond_to do |format|
      if @reservation.errors.blank? && @reservation.save
        format.html do
          redirect_to member? ? my_reservations_path : reservations_path,
                      notice: "Reservation updated successfully"
        end

        format.json do
          render json: serialize_reservation(@reservation)
        end
      else
        format.html do
          render inertia: "reservations/edit",
                 props: {
                   reservation: serialize_reservation(@reservation),
                   workspaces: serialize_workspaces(editable_workspaces),
                   errors: @reservation.errors.to_hash,
                   booking_rule: current_organization.booking_rule,
                   booking_time_slots: reservation_time_slots,
                   can_manage_status: admin? || manager?,
                   initial_unavailable_workspace_ids: initial_unavailable_workspace_ids_for(@reservation)
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: {
            errors: @reservation.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def cancel_confirmation
    render inertia: "reservations/cancel", props: {
      reservation: serialize_reservation(@reservation)
    }
  end

  def destroy
    booking_rule = current_organization.booking_rule

    if cancellation_blocked?(booking_rule)
      render_cancellation_blocked_response
      return
    end

    @reservation.status = "cancelled"

    respond_to do |format|
      if @reservation.save
        format.html do
          redirect_to member? ? my_reservations_path : reservations_path,
                      notice: "Reservation cancelled successfully"
        end

        format.json do
          render json: {
            message: "Reservation cancelled successfully",
            reservation: serialize_reservation(@reservation)
          }
        end
      else
        format.html do
          redirect_to member? ? my_reservations_path : reservations_path,
                      alert: "Reservation could not be cancelled"
        end

        format.json do
          render json: {
            errors: @reservation.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def my_reservations
    reservations = current_user
                   .reservations
                   .where(organization: current_organization)
                   .includes(:user, workspace: [ :amenities, { photo_attachment: :blob } ])
                   .order(start_time: :desc)

    render inertia: "reservations/my_reservations", props: {
      reservations: serialize_reservations(reservations)
    }
  end

  def availability
    start_time = Time.zone.parse(params[:start_time].to_s)
    end_time = Time.zone.parse(params[:end_time].to_s)

    if start_time.blank? || end_time.blank? || start_time >= end_time
      render json: {
        error: "Invalid date or time"
      }, status: :unprocessable_entity

      return
    end

    render json: {
      unavailable_workspace_ids: unavailable_workspace_ids_for(
        start_time,
        end_time,
        except_reservation_id: params[:reservation_id]
      )
    }
  rescue ArgumentError, TypeError
    render json: {
      error: "Invalid date or time"
    }, status: :unprocessable_entity
  end

  private

  def ensure_reservation_can_be_modified
  return if @reservation.modifiable?

  redirect_to reservation_path(@reservation),
              alert: "Concluded or cancelled reservations cannot be edited or cancelled."
  end

  def reservation_scope
    if member?
      current_user.reservations.where(organization: current_organization)
    else
      current_organization.reservations
    end
  end

  def set_reservation
    @reservation = reservation_scope
                   .includes(:user, workspace: [ :amenities, { photo_attachment: :blob } ])
                   .find(params[:id])
  end

  def active_workspaces
    current_organization
      .workspaces
      .where(active: true)
      .with_attached_photo
      .includes(:amenities)
      .order(:name)
  end

  def editable_workspaces
    current_organization
      .workspaces
      .where("active = ? OR id = ?", true, @reservation.workspace_id)
      .with_attached_photo
      .includes(:amenities)
      .order(:name)
  end

  def assign_workspace(workspace_id)
    workspace = current_organization
                .workspaces
                .find_by(id: workspace_id, active: true)

    @reservation.workspace = workspace
    @reservation.errors.add(:workspace_id, "is invalid") if workspace.blank?
  end

  def reservation_params
    permitted_attributes = [
      :workspace_id,
      :start_time,
      :end_time,
      :attendees_count,
      :notes
    ]

    permitted_attributes << :status if admin? || manager?

    params.require(:reservation).permit(permitted_attributes)
  end

  def initial_unavailable_workspace_ids_for(reservation)
    return [] if reservation.start_time.blank? || reservation.end_time.blank?
    return [] if reservation.start_time >= reservation.end_time

    unavailable_workspace_ids_for(
      reservation.start_time,
      reservation.end_time,
      except_reservation_id: reservation.id
    )
  end

  def unavailable_workspace_ids_for(start_time, end_time, except_reservation_id: nil)
  reservations = current_organization
                .reservations
                .where(status: Reservation::ACTIVE_STATUSES)
                .where(
                  "start_time < ? AND end_time > ?",
                  end_time,
                  start_time
                )

    if except_reservation_id.present?
      reservations = reservations.where.not(id: except_reservation_id)
    end

    reservations.pluck(:workspace_id).uniq
  end

  def unavailable_workspace_ids_from_params
    start_time = Time.zone.parse(reservation_params[:start_time].to_s)
    end_time = Time.zone.parse(reservation_params[:end_time].to_s)

    return [] if start_time.blank? || end_time.blank? || start_time >= end_time

    unavailable_workspace_ids_for(start_time, end_time)
  rescue ArgumentError, TypeError
    []
  end

  def cancellation_blocked?(booking_rule)
    return false unless booking_rule&.cancellation_limit_hours.present?

    cancellation_deadline = booking_rule.cancellation_limit_hours.hours.from_now

    @reservation.start_time < cancellation_deadline
  end

  def render_cancellation_blocked_response
    message = "This reservation cannot be cancelled because it starts too soon according to the organization's cancellation policy."

    respond_to do |format|
      format.html do
        render inertia: "reservations/cancel",
               props: {
                 reservation: serialize_reservation(@reservation),
                 cancel_error: message
               },
               status: :unprocessable_entity
      end

      format.json do
        render json: {
          errors: [
            message
          ]
        }, status: :unprocessable_entity
      end
    end
  end

  def reservation_time_slots
    return [] unless current_organization.custom_time_slots_enabled?

    current_organization
      .booking_time_slots
      .where(active: true)
      .order(:start_minute, :name)
      .as_json
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

  def serialize_workspaces(workspaces)
    workspaces.map do |workspace|
      serialize_workspace(workspace)
    end
  end

  def serialize_workspace(workspace)
    WorkspaceSerializer
      .new(workspace, view_context: view_context)
      .as_json
  end
end
