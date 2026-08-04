require "test_helper"

class BookingRuleTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "requires valid booking rule values" do
    rule = @organization.build_booking_rule(
      max_hours_per_reservation: nil,
      min_notice_minutes: nil,
      cancellation_limit_hours: nil,
      allow_weekend_bookings: nil
    )

    assert_not rule.valid?
    assert_includes rule.errors[:max_hours_per_reservation], "can't be blank"
    assert_includes rule.errors[:min_notice_minutes], "can't be blank"
    assert_includes rule.errors[:cancellation_limit_hours], "can't be blank"
    assert_includes rule.errors[:allow_weekend_bookings],
                    "is not included in the list"
  end

  test "rejects zero max hours per reservation" do
    rule = build_valid_rule
    rule.max_hours_per_reservation = 0

    assert_not rule.valid?
    assert_includes rule.errors[:max_hours_per_reservation],
                    "must be greater than 0"
  end

  test "rejects max hours greater than twelve" do
    rule = build_valid_rule
    rule.max_hours_per_reservation = 13

    assert_not rule.valid?
    assert_includes rule.errors[:max_hours_per_reservation],
                    "must be less than or equal to 12"
  end

  test "rejects negative minimum notice" do
    rule = build_valid_rule
    rule.min_notice_minutes = -1

    assert_not rule.valid?
    assert_includes rule.errors[:min_notice_minutes],
                    "must be greater than or equal to 0"
  end

  test "rejects minimum notice greater than seven days" do
    rule = build_valid_rule
    rule.min_notice_minutes = 10_081

    assert_not rule.valid?
    assert_includes rule.errors[:min_notice_minutes],
                    "must be less than or equal to 10080"
  end

  test "rejects negative cancellation limit" do
    rule = build_valid_rule
    rule.cancellation_limit_hours = -1

    assert_not rule.valid?
    assert_includes rule.errors[:cancellation_limit_hours],
                    "must be greater than or equal to 0"
  end

  test "rejects cancellation limit greater than seven days" do
    rule = build_valid_rule
    rule.cancellation_limit_hours = 169

    assert_not rule.valid?
    assert_includes rule.errors[:cancellation_limit_hours],
                    "must be less than or equal to 168"
  end

  test "accepts valid booking rule values" do
    rule = build_valid_rule

    assert rule.valid?
  end

  private

  def build_valid_rule
    @organization.build_booking_rule(
      max_hours_per_reservation: 2,
      min_notice_minutes: 60,
      cancellation_limit_hours: 24,
      allow_weekend_bookings: false
    )
  end
end
