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

  test "manager without active subscription cannot create workspace with html request" do
    sign_in @manager

    assert_no_difference "Workspace.count" do
      post workspaces_path,
           params: {
             workspace: workspace_params
           }
    end

    assert_redirected_to subscription_path
  end

  test "manager without active subscription receives payment required for json workspace creation" do
    sign_in @manager

    assert_no_difference "Workspace.count" do
      post workspaces_path,
           params: {
             workspace: workspace_params
           },
           as: :json
    end

    assert_response :payment_required

    body = JSON.parse(response.body)

    assert_equal "billing_required", body["code"]
    assert_equal "Choose a subscription plan to unlock Slotify.", body["error"]
  end

  test "manager without active subscription receives payment required for json availability check" do
    sign_in @manager

    start_time = next_weekday_time(hour: 10)

    get "/reservations/availability",
        params: {
          start_time: datetime_param(start_time),
          end_time: datetime_param(start_time + 1.hour)
        },
        as: :json

    assert_response :payment_required

    body = JSON.parse(response.body)

    assert_equal "billing_required", body["code"]
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

  test "starter manager at workspace limit cannot open new workspace page" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_workspace_limit"
    )

    6.times do
      create_workspace(organization: @organization)
    end

    sign_in @manager

    get new_workspace_path

    assert_redirected_to subscription_path
    assert_equal(
      "Your current plan has reached the workspace limit. Upgrade to Pro to add more workspaces.",
      flash[:alert]
    )
  end

  test "starter manager at workspace limit cannot create workspace through json" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_workspace_json_limit"
    )

    6.times do
      create_workspace(organization: @organization)
    end

    sign_in @manager

    assert_no_difference "Workspace.count" do
      post workspaces_path,
           params: {
             workspace: workspace_params
           },
           as: :json
    end

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)

    assert_equal "workspace_limit_reached", body["code"]
  end

  test "starter manager at member limit cannot invite member through json" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_member_json_limit"
    )

    10.times do
      create_user(
        organization: @organization,
        role_name: "member"
      )
    end

    create_invitation(
      organization: @organization,
      invited_by: @manager,
      role_name: "member"
    )

    sign_in @manager

    member_role = Role.find_by!(name: "member")

    assert_no_difference "OrganizationInvitation.count" do
      post organization_invitations_path,
           params: {
             organization_invitation: {
               email: "blocked.member@example.com",
               role_id: member_role.id
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)

    assert_equal "member_limit_reached", body["code"]
  end

  test "member cannot manage subscription page" do
    sign_in @member

    get subscription_path

    assert_redirected_to root_path
  end

  private

  def workspace_params
    {
      name: "Locked Workspace",
      workspace_type: "meeting_room",
      capacity: 6,
      floor: "3",
      zone: "East",
      location: "Main Building",
      description: "Workspace created from subscription access test",
      hourly_rate: 30,
      active: true,
      amenity_ids: []
    }
  end
end
