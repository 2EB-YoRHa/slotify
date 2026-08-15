require "test_helper"

class Reservations::AvailabilityQueryTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization(name: "Availability Primary")
    @other_organization = create_organization(name: "Availability Other")

    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_availability_primary"
    )

    create_subscription(
      organization: @other_organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_availability_other"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )

    @other_member = create_user(
      organization: @other_organization,
      role_name: "member"
    )

    @workspace = create_workspace(
      organization: @organization,
      name: "Availability Primary Workspace"
    )

    @cancelled_workspace = create_workspace(
      organization: @organization,
      name: "Cancelled Workspace"
    )

    @other_workspace = create_workspace(
      organization: @other_organization,
      name: "Availability Other Workspace"
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )

    create_booking_rule(
      organization: @other_organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )

    @start_time = next_weekday_time(hour: 10)
    @end_time = @start_time + 1.hour
  end

  test "returns overlapping active reservations for the organization only" do
    active_reservation = create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: @start_time,
      end_time: @end_time,
      status: "confirmed"
    )

    create_reservation(
      organization: @organization,
      user: @member,
      workspace: @cancelled_workspace,
      start_time: @start_time,
      end_time: @end_time,
      status: "cancelled"
    )

    create_reservation(
      organization: @other_organization,
      user: @other_member,
      workspace: @other_workspace,
      start_time: @start_time,
      end_time: @end_time,
      status: "confirmed"
    )

    unavailable_workspace_ids = Reservations::AvailabilityQuery.new(
      organization: @organization,
      start_time: @start_time + 15.minutes,
      end_time: @start_time + 45.minutes
    ).unavailable_workspace_ids

    assert_includes unavailable_workspace_ids, active_reservation.workspace_id
    assert_not_includes unavailable_workspace_ids, @cancelled_workspace.id
    assert_not_includes unavailable_workspace_ids, @other_workspace.id
  end

  test "ignores reservation passed as exception" do
    reservation = create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: @start_time,
      end_time: @end_time,
      status: "confirmed"
    )

    unavailable_workspace_ids = Reservations::AvailabilityQuery.new(
      organization: @organization,
      start_time: @start_time + 15.minutes,
      end_time: @start_time + 45.minutes,
      except_reservation_id: reservation.id
    ).unavailable_workspace_ids

    assert_not_includes unavailable_workspace_ids, @workspace.id
  end

  test "returns empty array for invalid time range" do
    unavailable_workspace_ids = Reservations::AvailabilityQuery.new(
      organization: @organization,
      start_time: @end_time,
      end_time: @start_time
    ).unavailable_workspace_ids

    assert_equal [], unavailable_workspace_ids
  end
end
