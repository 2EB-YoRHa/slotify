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
    assert_equal 6, subscription.workspace_limit
    assert_equal 12, subscription.user_limit
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

  test "starter plan includes richer frontend metadata" do
    starter = SubscriptionPlan.find!("starter")

    assert_equal "Starter", starter[:name]
    assert_equal "Essential", starter[:badge]
    assert_equal 6, starter[:workspace_limit]
    assert_equal 12, starter[:user_limit]
    assert starter[:best_for].present?
    assert starter[:highlights].any?
    assert starter[:limits].any?
    assert starter[:feature_groups].any?
  end

  test "pro plan includes richer frontend metadata" do
    pro = SubscriptionPlan.find!("pro")

    assert_equal "Pro", pro[:name]
    assert_equal "Recommended", pro[:badge]
    assert_nil pro[:workspace_limit]
    assert_nil pro[:user_limit]
    assert pro[:highlighted]
    assert pro[:best_for].present?
    assert pro[:highlights].any?
    assert pro[:limits].any?
    assert pro[:feature_groups].any?
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
