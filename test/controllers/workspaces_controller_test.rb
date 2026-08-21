require "test_helper"

class WorkspacesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_workspaces_starter"
    )

    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )
  end

  test "manager can create workspace" do
    sign_in @manager

    assert_difference "Workspace.count", 1 do
      post workspaces_path,
           params: {
             workspace: {
               name: "Test Boardroom",
               workspace_type: "meeting_room",
               capacity: 6,
               floor: "3",
               zone: "East",
               location: "Main Building",
               description: "Workspace created from test",
               hourly_rate: 30,
               active: true,
               amenity_ids: []
             }
           }
    end

    assert_redirected_to workspaces_path
  end

  test "member cannot open new workspace page" do
    sign_in @member

    get new_workspace_path

    assert_redirected_to root_path
  end

  test "member only receives active workspaces" do
    active_workspace = create_workspace(
      organization: @organization,
      name: "Active Member Workspace",
      active: true
    )

    inactive_workspace = create_workspace(
      organization: @organization,
      name: "Inactive Member Workspace",
      active: false
    )

    sign_in @member

    get workspaces_path, as: :json

    assert_response :success

    ids = JSON.parse(response.body).map { |workspace| workspace["id"] }

    assert_includes ids, active_workspace.id
    assert_not_includes ids, inactive_workspace.id
  end

  test "member cannot open inactive workspace" do
    inactive_workspace = create_workspace(
      organization: @organization,
      name: "Hidden Inactive Workspace",
      active: false
    )

    sign_in @member

    get workspace_path(inactive_workspace)

    assert_response :not_found
  end
end
