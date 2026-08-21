require "test_helper"

class ReservationCustomTimeSlotsTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization

    create_role(name: "manager")
    create_role(name: "member")

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )

    @workspace = create_workspace(
      organization: @organization,
      name: "Custom Slot Workspace",
      capacity: 8,
      active: true
    )
  end

  test "pro organization accepts reservation that matches an active custom time slot" do
    activate_pro_plan!

    start_time = next_weekday_time(hour: 8, minimum_notice_minutes: 0)
    end_time = start_time + 4.hours

    create_booking_time_slot_for(
      start_time: start_time,
      end_time: end_time
    )

    reservation = build_reservation(
      start_time: start_time,
      end_time: end_time
    )

    assert reservation.valid?
  end

  test "pro organization rejects reservation outside active custom time slots" do
    activate_pro_plan!

    slot_start = next_weekday_time(hour: 8, minimum_notice_minutes: 0)
    slot_end = slot_start + 4.hours

    create_booking_time_slot_for(
      start_time: slot_start,
      end_time: slot_end
    )

    reservation = build_reservation(
      start_time: slot_start + 1.hour,
      end_time: slot_end + 1.hour
    )

    assert_not reservation.valid?

    assert_includes(
      reservation.errors[:base],
      "Reservation must use one of the organization's active custom time slots."
    )
  end

  test "pro organization rejects reservation on a day without matching custom time slot" do
    activate_pro_plan!

    monday = next_named_weekday("monday", hour: 8)
    tuesday = next_named_weekday("tuesday", hour: 8)

    create_booking_time_slot_for(
      start_time: monday,
      end_time: monday + 4.hours,
      days_of_week: "monday"
    )

    reservation = build_reservation(
      start_time: tuesday,
      end_time: tuesday + 4.hours
    )

    assert_not reservation.valid?

    assert_includes(
      reservation.errors[:base],
      "Reservation must use one of the organization's active custom time slots."
    )
  end

  test "pro organization ignores inactive custom time slots" do
    activate_pro_plan!

    start_time = next_weekday_time(hour: 8, minimum_notice_minutes: 0)
    end_time = start_time + 4.hours

    create_booking_time_slot_for(
      start_time: start_time,
      end_time: end_time,
      active: false
    )

    reservation = build_reservation(
      start_time: start_time,
      end_time: end_time
    )

    assert reservation.valid?
  end

  test "pro organization without active custom time slots keeps standard reservation flow" do
    activate_pro_plan!

    start_time = next_weekday_time(hour: 10, minimum_notice_minutes: 0)
    end_time = start_time + 2.hours

    reservation = build_reservation(
      start_time: start_time,
      end_time: end_time
    )

    assert reservation.valid?
  end

  test "starter organization keeps standard reservation flow" do
    activate_starter_plan!

    start_time = next_weekday_time(hour: 10, minimum_notice_minutes: 0)
    end_time = start_time + 2.hours

    reservation = build_reservation(
      start_time: start_time,
      end_time: end_time
    )

    assert reservation.valid?
  end

  test "updating a reservation must respect active custom time slots" do
    activate_pro_plan!

    valid_start_time = next_weekday_time(hour: 8, minimum_notice_minutes: 0)
    valid_end_time = valid_start_time + 4.hours

    create_booking_time_slot_for(
      start_time: valid_start_time,
      end_time: valid_end_time
    )

    reservation = create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: valid_start_time,
      end_time: valid_end_time,
      status: "confirmed",
      attendees_count: 2
    )

    invalid_start_time = valid_start_time + 1.hour
    invalid_end_time = valid_end_time + 1.hour

    assert_not reservation.update(
      start_time: invalid_start_time,
      end_time: invalid_end_time
    )

    assert_includes(
      reservation.errors[:base],
      "Reservation must use one of the organization's active custom time slots."
    )
  end

  test "cancelled reservations are not forced to match custom time slots" do
    activate_pro_plan!

    slot_start = next_weekday_time(hour: 8, minimum_notice_minutes: 0)
    slot_end = slot_start + 4.hours

    create_booking_time_slot_for(
      start_time: slot_start,
      end_time: slot_end
    )

    reservation = build_reservation(
      start_time: slot_start + 1.hour,
      end_time: slot_end + 1.hour,
      status: "cancelled"
    )

    assert reservation.valid?
  end

  private

  def activate_starter_plan!
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_custom_slots_#{SecureRandom.hex(6)}"
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      cancellation_limit_hours: 1,
      allow_weekend_bookings: true
    )

    @organization.reload
  end

  def activate_pro_plan!
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_custom_slots_#{SecureRandom.hex(6)}",
      workspace_limit: nil,
      user_limit: nil
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 12,
      min_notice_minutes: 0,
      cancellation_limit_hours: 1,
      allow_weekend_bookings: true
    )

    @organization.reload
  end

  def build_reservation(start_time:, end_time:, status: "confirmed")
    @organization.reservations.build(
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: end_time,
      status: status,
      attendees_count: 2,
      notes: "Custom time slot reservation test"
    )
  end

  def create_booking_time_slot_for(
    start_time:,
    end_time:,
    days_of_week: nil,
    active: true
  )
    @organization.booking_time_slots.create!(
      name: unique_value("Time Slot"),
      start_minute: minutes_from_midnight(start_time),
      end_minute: minutes_from_midnight(end_time),
      days_of_week: days_of_week || start_time.strftime("%A").downcase,
      active: active
    )
  end

  def minutes_from_midnight(value)
    value.hour * 60 + value.min
  end

  def next_named_weekday(day_name, hour:)
    date = Time.zone.today
    target_day = day_name.downcase

    loop do
      candidate = Time.zone.local(date.year, date.month, date.day, hour, 0)

      return candidate if candidate.strftime("%A").downcase == target_day &&
                          candidate >= Time.current

      date += 1.day
    end
  end
end
