require "test_helper"

class OrganizationSubscriptionLimitsTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "uses starter limits when organization has no active subscription" do
    assert_equal "starter", @organization.current_plan
    assert_equal 10, @organization.workspace_limit
    assert_equal 20, @organization.user_limit
    assert @organization.can_start_subscription_checkout?
  end

  test "starter reaches workspace limit at ten workspaces" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_active"
    )

    10.times do
      create_workspace(organization: @organization)
    end

    assert_equal 10, @organization.workspace_limit
    assert_equal 10, @organization.workspaces_used
    assert @organization.workspace_limit_reached?
  end

  test "pro has unlimited workspace and user limits" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_active",
      workspace_limit: nil,
      user_limit: nil
    )

    12.times do
      create_workspace(organization: @organization)
    end

    assert_equal "pro", @organization.current_plan
    assert_nil @organization.workspace_limit
    assert_nil @organization.user_limit
    assert_not @organization.workspace_limit_reached?
    assert_not @organization.user_limit_reached?
  end

  test "cancelled pro subscription does not grant unlimited limits" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "cancelled",
      stripe_subscription_id: "sub_pro_cancelled",
      workspace_limit: nil,
      user_limit: nil
    )

    assert_equal "starter", @organization.current_plan
    assert_equal 10, @organization.workspace_limit
    assert_equal 20, @organization.user_limit
    assert @organization.can_start_subscription_checkout?
  end

  test "active stripe subscription prevents starting another checkout" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_active_stripe"
    )

    assert_not @organization.can_start_subscription_checkout?
  end

  test "pending invitations count as member slots" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_users"
    )

    manager = create_user(
      organization: @organization,
      role_name: "manager"
    )

    18.times do
      create_user(
        organization: @organization,
        role_name: "member"
      )
    end

    create_invitation(
      organization: @organization,
      invited_by: manager,
      role_name: "member"
    )

    assert_equal 19, @organization.users_used
    assert_equal 1, @organization.pending_invitation_slots
    assert_equal 20, @organization.member_slots_used
    assert @organization.user_limit_reached?
  end
end
