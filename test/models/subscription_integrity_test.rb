require "test_helper"

class SubscriptionIntegrityTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
  end

  test "allows only one active subscription per organization" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_active_one"
    )

    duplicate = @organization.subscriptions.build(
      plan_name: "pro",
      status: "active",
      starts_at: Time.current,
      stripe_subscription_id: "sub_active_two"
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors.full_messages,
                    "Organization already has an active subscription"
  end

  test "allows cancelled subscription when another active subscription exists" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_active"
    )

    cancelled = @organization.subscriptions.build(
      plan_name: "starter",
      status: "cancelled",
      starts_at: Time.current,
      ends_at: Time.current,
      stripe_subscription_id: "sub_cancelled"
    )

    assert cancelled.valid?
  end

  test "requires unique stripe subscription id" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_unique_test"
    )

    another_organization = create_organization

    duplicate = another_organization.subscriptions.build(
      plan_name: "pro",
      status: "cancelled",
      starts_at: Time.current,
      stripe_subscription_id: "sub_unique_test"
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors.full_messages,
                    "Stripe subscription has already been taken"
  end

  test "requires unique stripe checkout session id" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "cancelled",
      stripe_subscription_id: "sub_checkout_one",
      stripe_checkout_session_id: "cs_unique_test"
    )

    another_organization = create_organization

    duplicate = another_organization.subscriptions.build(
      plan_name: "starter",
      status: "cancelled",
      starts_at: Time.current,
      stripe_subscription_id: "sub_checkout_two",
      stripe_checkout_session_id: "cs_unique_test"
    )

    assert_not duplicate.valid?
    assert_includes duplicate.errors.full_messages,
                    "Stripe checkout session has already been taken"
  end
end
