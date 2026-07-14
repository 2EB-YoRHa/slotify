require "test_helper"

class OrganizationInvitationsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get organization_invitations_index_url
    assert_response :success
  end

  test "should get create" do
    get organization_invitations_create_url
    assert_response :success
  end

  test "should get update" do
    get organization_invitations_update_url
    assert_response :success
  end

  test "should get destroy" do
    get organization_invitations_destroy_url
    assert_response :success
  end
end
