module Reservations
  class AvailabilityQuery
    def initialize(organization:, start_time:, end_time:, except_reservation_id: nil)
      @organization = organization
      @start_time = start_time
      @end_time = end_time
      @except_reservation_id = except_reservation_id
    end

    def unavailable_workspace_ids
      return [] if invalid_time_range?

      overlapping_reservations.pluck(:workspace_id).uniq
    end

    private

      attr_reader :organization, :start_time, :end_time, :except_reservation_id

      def overlapping_reservations
        reservations = organization
                       .reservations
                       .where(status: Reservation::ACTIVE_STATUSES)
                       .where(
                         "start_time < ? AND end_time > ?",
                         end_time,
                         start_time
                       )

        return reservations if except_reservation_id.blank?

        reservations.where.not(id: except_reservation_id)
      end

      def invalid_time_range?
        start_time.blank? || end_time.blank? || start_time >= end_time
      end
  end
end
