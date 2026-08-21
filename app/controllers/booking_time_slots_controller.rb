class BookingTimeSlotsController < InertiaController
  before_action :require_manager_or_admin!
  before_action :require_custom_time_slots!
  before_action :set_booking_time_slot, only: %i[show update destroy]

  def index
    slots = current_organization
      .booking_time_slots
      .order(active: :desc, start_minute: :asc, name: :asc)

    respond_to do |format|
      format.html do
        render inertia: "booking_time_slots/index",
               props: {
                 booking_time_slots: slots.as_json,
                 custom_time_slots_enabled: true
               }
      end

      format.json do
        render json: slots.as_json
      end
    end
  end

  def show
    respond_to do |format|
      format.html do
        render inertia: "booking_time_slots/show",
               props: {
                 booking_time_slot: @booking_time_slot.as_json,
                 custom_time_slots_enabled: true
               }
      end

      format.json do
        render json: @booking_time_slot.as_json
      end
    end
  end

  def create
    slot = current_organization.booking_time_slots.build(
      booking_time_slot_params
    )

    respond_to do |format|
      if slot.save
        format.html do
          redirect_to booking_time_slots_path,
                      notice: "Time slot created successfully"
        end

        format.json do
          render json: slot.as_json,
                 status: :created
        end
      else
        format.html do
          redirect_to booking_time_slots_path,
                      alert: slot.errors.full_messages.to_sentence
        end

        format.json do
          render json: {
            errors: slot.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def update
    respond_to do |format|
      if @booking_time_slot.update(booking_time_slot_params)
        format.html do
          redirect_to booking_time_slots_path,
                      notice: "Time slot updated successfully"
        end

        format.json do
          render json: @booking_time_slot.as_json
        end
      else
        format.html do
          redirect_to booking_time_slots_path,
                      alert: @booking_time_slot.errors.full_messages.to_sentence
        end

        format.json do
          render json: {
            errors: @booking_time_slot.errors.full_messages
          }, status: :unprocessable_entity
        end
      end
    end
  end

  def destroy
    @booking_time_slot.destroy

    respond_to do |format|
      format.html do
        redirect_to booking_time_slots_path,
                    notice: "Time slot deleted successfully"
      end

      format.json do
        render json: {
          message: "Time slot deleted successfully"
        }
      end
    end
  end

  private

  def require_custom_time_slots!
    return if current_organization.custom_time_slots_enabled?

    message = "Custom time slots are available on the Pro plan."

    respond_to do |format|
      format.html do
        redirect_to subscription_path,
                    alert: message
      end

      format.json do
        render json: {
          error: message,
          code: "custom_time_slots_required"
        }, status: :payment_required
      end
    end
  end

  def set_booking_time_slot
    @booking_time_slot = current_organization
      .booking_time_slots
      .find(params[:id])
  end

  def booking_time_slot_params
    params.require(:booking_time_slot).permit(
      :name,
      :start_minute,
      :end_minute,
      :days_of_week,
      :active
    )
  end
end
