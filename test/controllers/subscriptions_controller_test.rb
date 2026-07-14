require "test_helper"

class SubscriptionsControllerTest < ActionDispatch::IntegrationTest
  test "should get show" do
    get subscriptions_show_url
    assert_response :success
  end
end
