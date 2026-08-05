require "test_helper"

class SubscriptionAccessTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

    create_role(name: "manager")
    create_role(name: "member")

    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )
  end

  test "manager without active subscription can open subscription page" do
    sign_in @manager

    get subscription_path

    assert_response :success
  end

  test "manager without active subscription is redirected from dashboard" do
    sign_in @manager

    get root_path

    assert_redirected_to subscription_path
    assert_equal "Choose a subscription plan to unlock Slotify.", flash[:alert]
  end

  test "manager without active subscription is redirected from organization page" do
    sign_in @manager

    get organization_path

    assert_redirected_to subscription_path
  end

  test "manager without active subscription is redirected from workspace creation" do
    sign_in @manager

    get new_workspace_path

    assert_redirected_to subscription_path
  end

  test "manager without active subscription cannot create workspace" do
    sign_in @manager

    assert_no_difference "Workspace.count" do
      post workspaces_path,
           params: {
             workspace: {
               name: "Locked Workspace",
               workspace_type: "meeting_room",
               capacity: 6,
               floor: "3",
               zone: "East",
               location: "Main Building",
               description: "Should not be created before billing",
               hourly_rate: 30,
               active: true,
               amenity_ids: []
             }
           }
    end

    assert_redirected_to subscription_path
  end

  test "manager without active subscription is redirected from booking rules" do
    sign_in @manager

    get booking_rule_path

    assert_redirected_to subscription_path
  end

  test "manager without active subscription is redirected from amenities" do
    sign_in @manager

    get amenities_path

    assert_redirected_to subscription_path
  end

  test "manager with active subscription can open dashboard" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_access"
    )

    sign_in @manager

    get root_path

    assert_response :success
  end

  test "manager with active subscription can open organization page" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_org_access"
    )

    sign_in @manager

    get organization_path

    assert_response :success
  end

  test "member cannot manage subscription page" do
    sign_in @member

    get subscription_path

    assert_redirected_to root_path
  end
end
