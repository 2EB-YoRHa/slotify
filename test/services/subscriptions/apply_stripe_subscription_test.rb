require "test_helper"

class Subscriptions::ApplyStripeSubscriptionTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "creates subscription when organization has none" do
    result = Subscriptions::ApplyStripeSubscription.new(
      organization: @organization,
      plan_key: "starter",
      status: "active",
      stripe_subscription_id: "sub_new_starter",
      stripe_price_id: "price_starter",
      stripe_checkout_session_id: "cs_starter",
      ends_at: 30.days.from_now
    ).call

    assert result.persisted?
    assert_equal 1, @organization.subscriptions.count
    assert_equal "starter", result.plan_name
    assert_equal "active", result.status
    assert_equal "sub_new_starter", result.stripe_subscription_id
  end

  test "updates existing subscription with same stripe subscription id" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_same_id",
      stripe_price_id: "price_starter"
    )

    result = Subscriptions::ApplyStripeSubscription.new(
      organization: @organization,
      plan_key: "pro",
      status: "active",
      stripe_subscription_id: "sub_same_id",
      stripe_price_id: "price_pro",
      stripe_checkout_session_id: "cs_pro",
      ends_at: 30.days.from_now
    ).call

    assert_equal 1, @organization.subscriptions.count
    assert_equal "pro", result.plan_name
    assert_nil result.workspace_limit
    assert_nil result.user_limit
    assert_equal "sub_same_id", result.stripe_subscription_id
  end

  test "updates existing subscription with same checkout session id" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: nil,
      stripe_checkout_session_id: "cs_same_id"
    )

    result = Subscriptions::ApplyStripeSubscription.new(
      organization: @organization,
      plan_key: "pro",
      status: "active",
      stripe_subscription_id: "sub_from_checkout",
      stripe_price_id: "price_pro",
      stripe_checkout_session_id: "cs_same_id",
      ends_at: 30.days.from_now
    ).call

    assert_equal 1, @organization.subscriptions.count
    assert_equal "pro", result.plan_name
    assert_equal "sub_from_checkout", result.stripe_subscription_id
    assert_equal "cs_same_id", result.stripe_checkout_session_id
  end

  test "reuses active subscription instead of creating duplicate" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_active_existing"
    )

    result = Subscriptions::ApplyStripeSubscription.new(
      organization: @organization,
      plan_key: "pro",
      status: "active",
      stripe_subscription_id: "sub_new_value",
      stripe_price_id: "price_pro",
      stripe_checkout_session_id: "cs_new_value",
      ends_at: 30.days.from_now
    ).call

    assert_equal 1, @organization.subscriptions.count
    assert_equal "pro", result.plan_name
    assert_equal "sub_new_value", result.stripe_subscription_id
  end
end
