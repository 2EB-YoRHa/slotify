require "test_helper"

class SubscriptionPlanTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "applies starter limits to subscription" do
    subscription = @organization.subscriptions.build

    SubscriptionPlan.apply_to!(
      subscription,
      plan_key: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_test",
      stripe_price_id: "price_starter_test",
      stripe_checkout_session_id: "cs_starter_test",
      ends_at: 30.days.from_now
    )

    assert subscription.persisted?
    assert_equal "starter", subscription.plan_name
    assert_equal "active", subscription.status
    assert_equal 10, subscription.workspace_limit
    assert_equal 20, subscription.user_limit
    assert_equal "sub_starter_test", subscription.stripe_subscription_id
  end

  test "applies pro as unlimited limits" do
    subscription = @organization.subscriptions.build

    SubscriptionPlan.apply_to!(
      subscription,
      plan_key: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_test",
      stripe_price_id: "price_pro_test",
      stripe_checkout_session_id: "cs_pro_test",
      ends_at: 30.days.from_now
    )

    assert subscription.persisted?
    assert_equal "pro", subscription.plan_name
    assert_equal "active", subscription.status
    assert_nil subscription.workspace_limit
    assert_nil subscription.user_limit
    assert_equal "sub_pro_test", subscription.stripe_subscription_id
  end

  test "raises error for invalid plan key" do
    subscription = @organization.subscriptions.build

    assert_raises ArgumentError do
      SubscriptionPlan.apply_to!(
        subscription,
        plan_key: "enterprise",
        status: "active"
      )
    end
  end

  test "rejects product id as stripe price id" do
    previous_value = ENV["STRIPE_PRO_PRICE_ID"]
    ENV["STRIPE_PRO_PRICE_ID"] = "prod_fake_product_id"

    error = assert_raises ArgumentError do
      SubscriptionPlan.stripe_price_id("pro")
    end

    assert_includes error.message, "must be a Stripe Price ID"
  ensure
    ENV["STRIPE_PRO_PRICE_ID"] = previous_value
  end

  test "detects plan key from stripe price id" do
    previous_value = ENV["STRIPE_PRO_PRICE_ID"]
    ENV["STRIPE_PRO_PRICE_ID"] = "price_fake_pro_id"

    assert_equal "pro", SubscriptionPlan.plan_key_for_price_id("price_fake_pro_id")
  ensure
    ENV["STRIPE_PRO_PRICE_ID"] = previous_value
  end
end
