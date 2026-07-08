module Reservations
  class CreateReservation
    class Result
      attr_reader :reservation, :errors

      def initialize(success:, reservation:, errors: [])
        @success = success
        @reservation = reservation
        @errors = errors
      end

      def success?
        @success
      end
    end

    def initialize(user:, params:)
      @user = user
      @organization = user.organization
      @params = params.to_h.symbolize_keys
    end

    def call
      reservation = build_reservation

      validate_workspace(reservation)
      validate_booking_rules(reservation)

      return failure(reservation) if reservation.errors.any?

      if reservation.save
        success(reservation)
      else
        failure(reservation)
      end
    end

    private

    def build_reservation
      workspace = @organization.workspaces.find_by(
        id: @params[:workspace_id],
        active: true
      )

      reservation = @organization.reservations.build(
        @params.except(:workspace_id)
      )

      reservation.user = @user
      reservation.workspace = workspace
      reservation.status = "confirmed" if reservation.status.blank?

      reservation
    end

    def validate_workspace(reservation)
      return if reservation.workspace.present?

      reservation.errors.add(
        :workspace,
        "must belong to your organization and be active"
      )
    end

    def validate_booking_rules(reservation)
      rules = @organization.booking_rule

      return if rules.blank?
      return if reservation.start_time.blank? || reservation.end_time.blank?

      validate_weekend_rule(reservation, rules)
      validate_min_notice_rule(reservation, rules)
      validate_max_hours_rule(reservation, rules)
    end

    def validate_weekend_rule(reservation, rules)
      return if rules.allow_weekend_bookings

      if reservation.start_time.saturday? || reservation.start_time.sunday?
        reservation.errors.add(:start_time, "cannot be on weekends")
      end
    end

    def validate_min_notice_rule(reservation, rules)
      return if rules.min_notice_minutes.blank?

      minimum_start_time = Time.current + rules.min_notice_minutes.minutes

      if reservation.start_time < minimum_start_time
        reservation.errors.add(
          :start_time,
          "does not meet the minimum notice time"
        )
      end
    end

    def validate_max_hours_rule(reservation, rules)
      return if rules.max_hours_per_reservation.blank?

      duration_hours = (reservation.end_time - reservation.start_time) / 1.hour

      if duration_hours > rules.max_hours_per_reservation
        reservation.errors.add(
          :end_time,
          "exceeds the maximum reservation duration"
        )
      end
    end

    def success(reservation)
      Result.new(
        success: true,
        reservation: reservation,
        errors: []
      )
    end

    def failure(reservation)
      Result.new(
        success: false,
        reservation: reservation,
        errors: reservation.errors.full_messages
      )
    end
  end
end