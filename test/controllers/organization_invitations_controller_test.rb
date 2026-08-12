require "test_helper"

class OrganizationInvitationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization
    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )
    @member_role = create_role(name: "member")

    create_subscription(
      organization: @organization,
      plan_name: "pro",
      workspace_limit: nil,
      user_limit: nil
    )
  end

  test "manager sends invitation email" do
    sign_in @manager

    assert_difference "OrganizationInvitation.count", 1 do
      assert_difference "ActionMailer::Base.deliveries.count", 1 do
        post organization_invitations_path,
             params: {
               organization_invitation: {
                 email: "new-member@slotify.test",
                 role_id: @member_role.id
               }
             }
      end
    end

    assert_redirected_to organization_path

    invitation = OrganizationInvitation.find_by!(email: "new-member@slotify.test")
    email = ActionMailer::Base.deliveries.last

    assert_equal [ invitation.email ], email.to
    assert_includes email.subject, @organization.name
    assert_includes email.body.encoded, invitation.token
  end

  test "member cannot send invitations" do
    member = create_user(
      organization: @organization,
      role_name: "member"
    )

    sign_in member

    assert_no_difference "OrganizationInvitation.count" do
      assert_no_difference "ActionMailer::Base.deliveries.count" do
        post organization_invitations_path,
             params: {
               organization_invitation: {
                 email: "blocked-member@slotify.test",
                 role_id: @member_role.id
               }
             }
      end
    end
  end
end
