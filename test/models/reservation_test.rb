require "test_helper"

class ReservationTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
    @member = create_user(
      organization: @organization,
      role_name: "member"
    )
    @workspace = create_workspace(
      organization: @organization,
      capacity: 4
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )
  end

  test "is valid with valid attributes" do
    start_time = next_weekday_time(hour: 10)

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 1.hour,
      status: "confirmed",
      attendees_count: 2
    )

    assert reservation.valid?, reservation.errors.full_messages.to_sentence
  end

  test "rejects end time before start time" do
    start_time = next_weekday_time(hour: 10)

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time - 1.hour,
      status: "confirmed",
      attendees_count: 1
    )

    assert_not reservation.valid?
    assert_includes reservation.errors[:end_time], "must be after start time"
  end

  test "rejects overlapping reservations for the same workspace" do
    start_time = next_weekday_time(hour: 10)

    create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 2.hours
    )

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time + 30.minutes,
      end_time: start_time + 90.minutes,
      status: "confirmed",
      attendees_count: 1
    )

    assert_not reservation.valid?
    assert_includes reservation.errors[:base], "Workspace is already reserved for this time"
  end

  test "allows back to back reservations" do
    start_time = next_weekday_time(hour: 10)

    create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 1.hour
    )

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time + 1.hour,
      end_time: start_time + 2.hours,
      status: "confirmed",
      attendees_count: 1
    )

    assert reservation.valid?, reservation.errors.full_messages.to_sentence
  end

  test "rejects attendees above workspace capacity" do
    start_time = next_weekday_time(hour: 10)

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 1.hour,
      status: "confirmed",
      attendees_count: 5
    )

    assert_not reservation.valid?
    assert_includes reservation.errors[:attendees_count], "cannot exceed workspace capacity"
  end

  test "rejects reservations that exceed max hours booking rule" do
    @organization.booking_rule.update!(
      max_hours_per_reservation: 2
    )

    start_time = next_weekday_time(hour: 10)

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 3.hours,
      status: "confirmed",
      attendees_count: 1
    )

    assert_not reservation.valid?
    assert_includes reservation.errors[:base], "Reservation cannot exceed 2 hours."
  end

  test "rejects reservations inside minimum notice window" do
    @organization.booking_rule.update!(
      min_notice_minutes: 60
    )

    travel_to Time.zone.local(2026, 7, 30, 13, 0, 0) do
      reservation = Reservation.new(
        organization: @organization,
        user: @member,
        workspace: @workspace,
        start_time: Time.zone.local(2026, 7, 30, 13, 30, 0),
        end_time: Time.zone.local(2026, 7, 30, 14, 30, 0),
        status: "confirmed",
        attendees_count: 1
      )

      assert_not reservation.valid?
      assert_includes reservation.errors[:base], "Reservation must be made at least 60 minutes in advance."
    end
  end

  test "rejects weekend reservations when weekends are blocked" do
    @organization.booking_rule.update!(
      allow_weekend_bookings: false,
      min_notice_minutes: 0
    )

    travel_to Time.zone.local(2026, 1, 5, 9, 0, 0) do
      saturday = Time.zone.local(2026, 1, 10, 10, 0, 0)

      reservation = Reservation.new(
        organization: @organization,
        user: @member,
        workspace: @workspace,
        start_time: saturday,
        end_time: saturday + 1.hour,
        status: "confirmed",
        attendees_count: 2
      )

      assert_not reservation.valid?

      assert_includes reservation.errors.full_messages,
                      "Weekend bookings are not allowed."
    end
  end

  test "rejects non integer attendees count" do
  start_time = next_weekday_time(hour: 10)

  reservation = Reservation.new(
    organization: @organization,
    user: @member,
    workspace: @workspace,
    start_time: start_time,
    end_time: start_time + 1.hour,
    status: "confirmed",
    attendees_count: 1.5
  )

  assert_not reservation.valid?
  assert_includes reservation.errors[:attendees_count], "must be an integer"
  end

  test "rejects notes longer than five hundred characters" do
    start_time = next_weekday_time(hour: 10)

    reservation = Reservation.new(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 1.hour,
      status: "confirmed",
      attendees_count: 1,
      notes: "a" * 501
    )

    assert_not reservation.valid?
    assert_includes reservation.errors[:notes],
                    "is too long (maximum is 500 characters)"
  end
end
