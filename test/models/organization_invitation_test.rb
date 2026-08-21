require "test_helper"

class OrganizationInvitationTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )
    @member_role = create_role(name: "member")
  end

  test "normalizes email before validation" do
    invitation = @organization.organization_invitations.create!(
      email: "  PERSON@EXAMPLE.COM  ",
      role: @member_role,
      invited_by: @manager
    )

    assert_equal "person@example.com", invitation.email
  end

  test "rejects invalid email" do
    invitation = @organization.organization_invitations.build(
      email: "invalid-email",
      role: @member_role,
      invited_by: @manager
    )

    assert_not invitation.valid?
    assert_includes invitation.errors[:email], "is invalid"
  end

  test "sets default token status and expiration" do
    invitation = @organization.organization_invitations.create!(
      email: "new.member@example.com",
      role: @member_role,
      invited_by: @manager
    )

    assert invitation.token.present?
    assert_equal "pending", invitation.status
    assert invitation.expires_at.present?
  end

  test "rejects invalid status" do
    invitation = @organization.organization_invitations.build(
      email: "new.member@example.com",
      role: @member_role,
      invited_by: @manager,
      status: "unknown"
    )

    assert_not invitation.valid?
    assert_includes invitation.errors[:status],
                    "is not included in the list"
  end

  test "rejects invitation when email already belongs to organization" do
    existing_user = create_user(
      organization: @organization,
      role_name: "member"
    )

    invitation = @organization.organization_invitations.build(
      email: existing_user.email,
      role: @member_role,
      invited_by: @manager
    )

    assert_not invitation.valid?
    assert_includes invitation.errors[:email],
                    "already belongs to this organization"
  end

  test "rejects duplicated pending invitation" do
    @organization.organization_invitations.create!(
      email: "duplicate@example.com",
      role: @member_role,
      invited_by: @manager
    )

    duplicate = @organization.organization_invitations.build(
      email: "duplicate@example.com",
      role: @member_role,
      invited_by: @manager
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors[:email],
                    "already has a pending invitation"
  end
end
