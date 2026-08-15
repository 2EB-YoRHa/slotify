module Reservations
  class CancellationPolicy
    attr_reader :reservation, :booking_rule

    MESSAGE = "This reservation cannot be cancelled because it starts too soon according to the organization's cancellation policy.".freeze

    def initialize(reservation:, booking_rule:)
      @reservation = reservation
      @booking_rule = booking_rule
    end

    def blocked?
      return false unless booking_rule&.cancellation_limit_hours.present?

      reservation.start_time < cancellation_deadline
    end

    def message
      MESSAGE
    end

    private

      def cancellation_deadline
        booking_rule.cancellation_limit_hours.hours.from_now
      end
  end
end
