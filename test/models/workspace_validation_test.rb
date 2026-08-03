require "test_helper"

class WorkspaceValidationTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "requires valid workspace data" do
    workspace = @organization.workspaces.build

    assert_not workspace.valid?
    assert_includes workspace.errors[:name], "can't be blank"
    assert_includes workspace.errors[:workspace_type], "can't be blank"
    assert_includes workspace.errors[:capacity], "can't be blank"
    assert_includes workspace.errors[:hourly_rate], "can't be blank"
    assert_includes workspace.errors[:location], "can't be blank"
  end

  test "rejects invalid workspace type" do
    workspace = create_workspace(organization: @organization)
    workspace.workspace_type = "invalid_type"

    assert_not workspace.valid?
    assert_includes workspace.errors[:workspace_type], "is not included in the list"
  end

  test "rejects capacity less than one" do
    workspace = create_workspace(organization: @organization)
    workspace.capacity = 0

    assert_not workspace.valid?
    assert_includes workspace.errors[:capacity], "must be greater than 0"
  end

  test "rejects negative hourly rate" do
    workspace = create_workspace(organization: @organization)
    workspace.hourly_rate = -1

    assert_not workspace.valid?
    assert_includes workspace.errors[:hourly_rate], "must be greater than or equal to 0"
  end

  test "rejects very long description" do
    workspace = create_workspace(organization: @organization)
    workspace.description = "a" * 501

    assert_not workspace.valid?
    assert_includes workspace.errors[:description], "is too long (maximum is 500 characters)"
  end
end
