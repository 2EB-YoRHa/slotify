require "test_helper"

class OrganizationSubscriptionLimitsTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "uses billing required limits when organization has no active subscription" do
    assert @organization.billing_required?
    assert_not @organization.subscription_active?
    assert_equal "billing_required", @organization.current_plan
    assert_nil @organization.current_plan_definition

    assert_equal 0, @organization.workspace_limit
    assert_equal 1, @organization.user_limit

    assert_equal 0, @organization.workspaces_used
    assert_equal 0, @organization.users_used
    assert_equal 0, @organization.pending_invitation_slots
    assert_equal 0, @organization.member_slots_used

    assert_equal 0, @organization.workspace_slots_remaining
    assert_equal 1, @organization.member_slots_remaining

    assert @organization.workspace_limit_reached?
    assert_not @organization.user_limit_reached?

    assert_not @organization.workspace_over_limit?
    assert_not @organization.user_over_limit?
    assert_not @organization.over_plan_limits?

    assert @organization.can_start_subscription_checkout?
  end

  test "billing required manager consumes the only allowed user slot" do
    create_user(
      organization: @organization,
      role_name: "manager"
    )

    assert @organization.billing_required?
    assert_equal 1, @organization.user_limit
    assert_equal 1, @organization.users_used
    assert_equal 1, @organization.member_slots_used
    assert_equal 0, @organization.member_slots_remaining
    assert @organization.user_limit_reached?
    assert_not @organization.user_over_limit?
  end

  test "billing required detects member over limit" do
    2.times do
      create_user(
        organization: @organization,
        role_name: "member"
      )
    end

    assert @organization.billing_required?
    assert_equal 1, @organization.user_limit
    assert_equal 2, @organization.member_slots_used
    assert_equal 0, @organization.member_slots_remaining
    assert @organization.user_limit_reached?
    assert @organization.user_over_limit?
    assert @organization.over_plan_limits?

    usage = @organization.plan_usage

    assert_equal "billing_required", usage[:current_plan]
    assert_equal true, usage[:billing_required]
    assert_equal true, usage[:user_over_limit]
    assert_equal true, usage[:over_plan_limits]
    assert_equal 2, usage[:member_slots_used]
    assert_equal 1, usage[:user_limit]
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

    assert_not @organization.billing_required?
    assert @organization.subscription_active?
    assert_equal "starter", @organization.current_plan
    assert_equal 10, @organization.workspace_limit
    assert_equal 10, @organization.workspaces_used
    assert_equal 0, @organization.workspace_slots_remaining
    assert @organization.workspace_limit_reached?
    assert_not @organization.workspace_over_limit?
  end

  test "starter detects workspace over limit after downgrade" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_downgraded"
    )

    12.times do
      create_workspace(organization: @organization)
    end

    assert_equal "starter", @organization.current_plan
    assert_equal 10, @organization.workspace_limit
    assert_equal 12, @organization.workspaces_used
    assert_equal 0, @organization.workspace_slots_remaining
    assert @organization.workspace_limit_reached?
    assert @organization.workspace_over_limit?
    assert @organization.over_plan_limits?

    usage = @organization.plan_usage

    assert_equal false, usage[:billing_required]
    assert_equal true, usage[:workspace_over_limit]
    assert_equal true, usage[:over_plan_limits]
    assert_equal 12, usage[:workspaces_used]
    assert_equal 10, usage[:workspace_limit]
    assert_equal 0, usage[:workspace_slots_remaining]
  end

  test "starter detects member over limit after downgrade" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_member_downgraded"
    )

    16.times do
      create_user(
        organization: @organization,
        role_name: "member"
      )
    end

    assert_equal 15, @organization.user_limit
    assert_equal 16, @organization.member_slots_used
    assert_equal 0, @organization.member_slots_remaining
    assert @organization.user_limit_reached?
    assert @organization.user_over_limit?
    assert @organization.over_plan_limits?

    usage = @organization.plan_usage

    assert_equal false, usage[:billing_required]
    assert_equal true, usage[:user_over_limit]
    assert_equal true, usage[:over_plan_limits]
    assert_equal 16, usage[:member_slots_used]
    assert_equal 15, usage[:user_limit]
    assert_equal 0, usage[:member_slots_remaining]
  end

  test "starter active subscription with old nil stored limits uses catalog limits" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_old_data",
      workspace_limit: nil,
      user_limit: nil
    )

    assert_equal "starter", @organization.current_plan
    assert_equal 10, @organization.workspace_limit
    assert_equal 15, @organization.user_limit
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

    assert_not @organization.billing_required?
    assert @organization.subscription_active?
    assert_equal "pro", @organization.current_plan
    assert_nil @organization.workspace_limit
    assert_nil @organization.user_limit
    assert_nil @organization.workspace_slots_remaining
    assert_nil @organization.member_slots_remaining
    assert_not @organization.workspace_limit_reached?
    assert_not @organization.user_limit_reached?
    assert_not @organization.workspace_over_limit?
    assert_not @organization.user_over_limit?
    assert_not @organization.over_plan_limits?
  end

  test "cancelled pro subscription returns to billing required" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "cancelled",
      stripe_subscription_id: "sub_pro_cancelled",
      workspace_limit: nil,
      user_limit: nil
    )

    assert @organization.billing_required?
    assert_not @organization.subscription_active?
    assert_equal "billing_required", @organization.current_plan
    assert_equal 0, @organization.workspace_limit
    assert_equal 1, @organization.user_limit
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

  test "pending invitations count as member slots on starter" do
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

    13.times do
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

    assert_equal 14, @organization.users_used
    assert_equal 1, @organization.pending_invitation_slots
    assert_equal 15, @organization.member_slots_used
    assert_equal 0, @organization.member_slots_remaining
    assert @organization.user_limit_reached?
    assert_not @organization.user_over_limit?
  end
end
