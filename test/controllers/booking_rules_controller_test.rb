require "test_helper"

class BookingRulesControllerTest < ActionDispatch::IntegrationTest
  test "should get edit" do
    get booking_rules_edit_url
    assert_response :success
  end

  test "should get update" do
    get booking_rules_update_url
    assert_response :success
  end
end
