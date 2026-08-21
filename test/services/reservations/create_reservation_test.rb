require "test_helper"

class Reservations::CreateReservationTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
    @member = create_user(
      organization: @organization,
      role_name: "member"
    )
    @workspace = create_workspace(
      organization: @organization,
      capacity: 4,
      active: true
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 60,
      allow_weekend_bookings: true
    )
  end

  test "creates confirmed reservation with valid local datetime strings" do
    travel_to Time.zone.local(2026, 7, 30, 13, 0, 0) do
      start_time = Time.zone.local(2026, 7, 30, 15, 0, 0)
      end_time = start_time + 1.hour

      result = Reservations::CreateReservation.new(
        user: @member,
        params: {
          workspace_id: @workspace.id,
          start_time: datetime_param(start_time),
          end_time: datetime_param(end_time),
          attendees_count: 2,
          notes: "Team planning"
        }
      ).call

      assert result.success?, result.errors.to_sentence
      assert result.reservation.persisted?
      assert_equal "confirmed", result.reservation.status
      assert_equal @member, result.reservation.user
      assert_equal @workspace, result.reservation.workspace
    end
  end

  test "rejects reservation inside minimum notice window" do
    travel_to Time.zone.local(2026, 7, 30, 13, 0, 0) do
      start_time = Time.zone.local(2026, 7, 30, 13, 30, 0)
      end_time = start_time + 1.hour

      result = Reservations::CreateReservation.new(
        user: @member,
        params: {
          workspace_id: @workspace.id,
          start_time: datetime_param(start_time),
          end_time: datetime_param(end_time),
          attendees_count: 1
        }
      ).call

      assert_not result.success?
      assert result.errors.any? { |error| error.include?("60 minutes") }
    end
  end

  test "rejects inactive workspace" do
    @workspace.update!(active: false)

    start_time = next_weekday_time(hour: 10)

    result = Reservations::CreateReservation.new(
      user: @member,
      params: {
        workspace_id: @workspace.id,
        start_time: datetime_param(start_time),
        end_time: datetime_param(start_time + 1.hour),
        attendees_count: 1
      }
    ).call

    assert_not result.success?
    assert result.errors.any? { |error| error.include?("Workspace") }
  end
end
