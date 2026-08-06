require "test_helper"

class BookingTimeSlotTest < ActiveSupport::TestCase
  test "starter organization cannot create booking time slots" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_time_slots"
    )

    slot = organization.booking_time_slots.build(
      name: "Morning Block",
      start_minute: 8 * 60,
      end_minute: 12 * 60,
      days_of_week: "monday,tuesday,wednesday",
      active: true
    )

    assert_not slot.valid?
    assert_includes(
      slot.errors[:base],
      "Custom time slots are only available on the Pro plan"
    )
  end

  test "pro organization can create booking time slots" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_time_slots",
      workspace_limit: nil,
      user_limit: nil
    )

    slot = organization.booking_time_slots.build(
      name: "Morning Block",
      start_minute: 8 * 60,
      end_minute: 12 * 60,
      days_of_week: "monday,tuesday,wednesday",
      active: true
    )

    assert slot.valid?
  end

  test "end minute must be after start minute" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_invalid_time_slot",
      workspace_limit: nil,
      user_limit: nil
    )

    slot = organization.booking_time_slots.build(
      name: "Invalid Block",
      start_minute: 12 * 60,
      end_minute: 8 * 60,
      days_of_week: "monday",
      active: true
    )

    assert_not slot.valid?
    assert_includes(
      slot.errors[:end_minute],
      "must be after the start time"
    )
  end

  test "days of week must be valid" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_invalid_days",
      workspace_limit: nil,
      user_limit: nil
    )

    slot = organization.booking_time_slots.build(
      name: "Invalid Days",
      start_minute: 8 * 60,
      end_minute: 12 * 60,
      days_of_week: "monday,funday",
      active: true
    )

    assert_not slot.valid?
    assert_includes(
      slot.errors[:days_of_week],
      "contains invalid days"
    )
  end

  test "minute labels are formatted as time labels" do
    organization = create_organization

    create_subscription(
      organization: organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_time_labels",
      workspace_limit: nil,
      user_limit: nil
    )

    slot = organization.booking_time_slots.create!(
      name: "Afternoon Block",
      start_minute: 13 * 60 + 30,
      end_minute: 17 * 60,
      days_of_week: "monday,friday",
      active: true
    )

    assert_equal "13:30", slot.start_time_label
    assert_equal "17:00", slot.end_time_label
    assert_equal 210, slot.duration_minutes
    assert slot.available_on?(Date.parse("2026-08-03"))
    assert_not slot.available_on?(Date.parse("2026-08-04"))
  end
end
