require "test_helper"

class Reservations::CancellationPolicyTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization(name: "Cancellation Policy Org")

    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_cancellation_policy"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )

    @workspace = create_workspace(
      organization: @organization,
      name: "Cancellation Policy Workspace"
    )
  end

  test "blocks cancellation when reservation starts inside cancellation limit" do
    travel_to Time.zone.local(2026, 1, 5, 9, 0, 0) do
      booking_rule = create_booking_rule(
        organization: @organization,
        max_hours_per_reservation: 4,
        min_notice_minutes: 0,
        cancellation_limit_hours: 2,
        allow_weekend_bookings: true
      )

      reservation = create_reservation(
        organization: @organization,
        user: @member,
        workspace: @workspace,
        start_time: Time.current + 1.hour,
        end_time: Time.current + 2.hours
      )

      policy = Reservations::CancellationPolicy.new(
        reservation: reservation,
        booking_rule: booking_rule
      )

      assert policy.blocked?
      assert_equal Reservations::CancellationPolicy::MESSAGE, policy.message
    end
  end

  test "allows cancellation when reservation starts after cancellation limit" do
    travel_to Time.zone.local(2026, 1, 5, 9, 0, 0) do
      booking_rule = create_booking_rule(
        organization: @organization,
        max_hours_per_reservation: 4,
        min_notice_minutes: 0,
        cancellation_limit_hours: 2,
        allow_weekend_bookings: true
      )

      reservation = create_reservation(
        organization: @organization,
        user: @member,
        workspace: @workspace,
        start_time: Time.current + 3.hours,
        end_time: Time.current + 4.hours
      )

      policy = Reservations::CancellationPolicy.new(
        reservation: reservation,
        booking_rule: booking_rule
      )

      assert_not policy.blocked?
    end
  end

  test "zero cancellation limit allows future reservations to be cancelled" do
    travel_to Time.zone.local(2026, 1, 5, 9, 0, 0) do
      booking_rule = create_booking_rule(
        organization: @organization,
        max_hours_per_reservation: 4,
        min_notice_minutes: 0,
        cancellation_limit_hours: 0,
        allow_weekend_bookings: true
      )

      reservation = create_reservation(
        organization: @organization,
        user: @member,
        workspace: @workspace,
        start_time: Time.current + 30.minutes,
        end_time: Time.current + 90.minutes
      )

      policy = Reservations::CancellationPolicy.new(
        reservation: reservation,
        booking_rule: booking_rule
      )

      assert_not policy.blocked?
    end
  end
end
