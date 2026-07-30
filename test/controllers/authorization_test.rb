require "test_helper"

class AuthorizationTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

    create_role(name: "member")
    create_role(name: "manager")

    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )
  end

  test "manager can access organization page" do
    sign_in @manager

    get organization_path

    assert_response :success
  end

  test "member cannot access organization page" do
    sign_in @member

    get organization_path

    assert_redirected_to root_path
  end
end
