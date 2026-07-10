class BookingRulesController < InertiaController
  before_action :require_manager_or_admin!
  before_action :set_booking_rule

  def show
    respond_to do |format|
      format.html do
        render inertia: "booking_rules/show", props: {
          booking_rule: @booking_rule
        }
      end

      format.json do
        render json: @booking_rule
      end
    end
  end

  def edit
    render inertia: "booking_rules/edit", props: {
      booking_rule: @booking_rule
    }
  end

  def update
    respond_to do |format|
      if @booking_rule.update(booking_rule_params)
        format.html do
          redirect_to booking_rule_path,
                      notice: "Booking rules updated successfully"
        end

        format.json do
          render json: @booking_rule
        end
      else
        format.html do
          render inertia: "booking_rules/edit",
                 props: {
                   booking_rule: @booking_rule,
                   errors: @booking_rule.errors.to_hash
                 },
                 status: :unprocessable_entity
        end

        format.json do
          render json: { errors: @booking_rule.errors.full_messages },
                 status: :unprocessable_entity
        end
      end
    end
  end

  private

  def set_booking_rule
    @booking_rule = current_organization.booking_rule

    return if @booking_rule.present?

    @booking_rule = current_organization.create_booking_rule!(
      max_hours_per_reservation: 4,
      min_notice_minutes: 30,
      cancellation_limit_hours: 24,
      allow_weekend_bookings: false
    )
  end

  def booking_rule_params
    params.require(:booking_rule).permit(
      :max_hours_per_reservation,
      :min_notice_minutes,
      :cancellation_limit_hours,
      :allow_weekend_bookings
    )
  end
end