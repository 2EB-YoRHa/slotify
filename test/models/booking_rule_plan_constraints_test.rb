require "test_helper"

class BookingRulePlanConstraintsTest < ActiveSupport::TestCase
  test "starter exposes standard booking rule constraints" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_booking_constraints"
    )

    constraints = organization.booking_rule_constraints

    assert_equal 1, constraints[:max_hours_per_reservation_min]
    assert_equal 4, constraints[:max_hours_per_reservation_max]
    assert_equal 0, constraints[:min_notice_minutes_min]
    assert_equal 1_440, constraints[:min_notice_minutes_max]
    assert_equal 0, constraints[:cancellation_limit_hours_min]
    assert_equal 72, constraints[:cancellation_limit_hours_max]
  end

  test "pro exposes advanced booking rule constraints" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_booking_constraints",
      workspace_limit: nil,
      user_limit: nil
    )

    constraints = organization.booking_rule_constraints

    assert_equal 1, constraints[:max_hours_per_reservation_min]
    assert_equal 12, constraints[:max_hours_per_reservation_max]
    assert_equal 0, constraints[:min_notice_minutes_min]
    assert_equal 10_080, constraints[:min_notice_minutes_max]
    assert_equal 0, constraints[:cancellation_limit_hours_min]
    assert_equal 168, constraints[:cancellation_limit_hours_max]
  end

  test "starter accepts values within starter limits" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_valid_booking_rule"
    )

    booking_rule = BookingRule.new(
      organization: organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 1_440,
      cancellation_limit_hours: 72,
      allow_weekend_bookings: true
    )

    assert booking_rule.valid?
  end

  test "starter rejects values above starter booking rule limits" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_invalid_booking_rule"
    )

    booking_rule = BookingRule.new(
      organization: organization,
      max_hours_per_reservation: 5,
      min_notice_minutes: 1_441,
      cancellation_limit_hours: 73,
      allow_weekend_bookings: true
    )

    assert_not booking_rule.valid?

    assert_includes(
      booking_rule.errors[:max_hours_per_reservation],
      "must be less than or equal to 4 on the Starter plan"
    )

    assert_includes(
      booking_rule.errors[:min_notice_minutes],
      "must be less than or equal to 1440 on the Starter plan"
    )

    assert_includes(
      booking_rule.errors[:cancellation_limit_hours],
      "must be less than or equal to 72 on the Starter plan"
    )
  end

  test "pro accepts advanced booking rule values" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_valid_booking_rule",
      workspace_limit: nil,
      user_limit: nil
    )

    booking_rule = BookingRule.new(
      organization: organization,
      max_hours_per_reservation: 12,
      min_notice_minutes: 10_080,
      cancellation_limit_hours: 168,
      allow_weekend_bookings: true
    )

    assert booking_rule.valid?
  end

  test "pro still rejects values above global safe limits" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_invalid_booking_rule",
      workspace_limit: nil,
      user_limit: nil
    )

    booking_rule = BookingRule.new(
      organization: organization,
      max_hours_per_reservation: 13,
      min_notice_minutes: 10_081,
      cancellation_limit_hours: 169,
      allow_weekend_bookings: true
    )

    assert_not booking_rule.valid?

    assert booking_rule.errors[:max_hours_per_reservation].any?
    assert booking_rule.errors[:min_notice_minutes].any?
    assert booking_rule.errors[:cancellation_limit_hours].any?
  end

  test "billing required exposes locked booking rule constraints" do
    organization = create_organization

    constraints = organization.booking_rule_constraints

    assert_equal "billing_required", organization.current_plan
    assert_equal 1, constraints[:max_hours_per_reservation_min]
    assert_equal 1, constraints[:max_hours_per_reservation_max]
    assert_equal 60, constraints[:min_notice_minutes_min]
    assert_equal 60, constraints[:min_notice_minutes_max]
    assert_equal 24, constraints[:cancellation_limit_hours_min]
    assert_equal 24, constraints[:cancellation_limit_hours_max]
  end

  test "starter entitlements keep premium features locked" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_entitlements"
    )

    assert_equal "starter", organization.current_plan

    assert_not organization.advanced_booking_rules_enabled?
    assert_not organization.custom_time_slots_enabled?
    assert_not organization.usage_insights_enabled?
    assert_not organization.availability_command_center_enabled?
    assert_not organization.multiple_workspace_photos_enabled?
    assert_not organization.priority_support_enabled?
  end

  test "pro entitlements unlock premium features" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_entitlements",
      workspace_limit: nil,
      user_limit: nil
    )

    assert_equal "pro", organization.current_plan

    assert organization.advanced_booking_rules_enabled?
    assert organization.custom_time_slots_enabled?
    assert organization.usage_insights_enabled?
    assert organization.availability_command_center_enabled?
    assert organization.multiple_workspace_photos_enabled?
    assert organization.priority_support_enabled?
  end
end
