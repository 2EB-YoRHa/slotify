require "test_helper"

class AmenitiesControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get amenities_index_url
    assert_response :success
  end

  test "should get create" do
    get amenities_create_url
    assert_response :success
  end

  test "should get destroy" do
    get amenities_destroy_url
    assert_response :success
  end
end
