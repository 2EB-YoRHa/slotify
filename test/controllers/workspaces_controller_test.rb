require "test_helper"

class WorkspacesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

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
end
