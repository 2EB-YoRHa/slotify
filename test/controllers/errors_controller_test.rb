require "test_helper"

class ErrorsControllerTest < ActionDispatch::IntegrationTest
  test "shows not found page for unmatched routes" do
    get "/this-route-does-not-exist"

    assert_response :not_found
    assert_includes response.body, "errors/show"
  end

  test "shows explicit not found page" do
    get "/errors/404"

    assert_response :not_found
    assert_includes response.body, "errors/show"
  end

  test "shows forbidden page" do
    get "/errors/403"

    assert_response :forbidden
    assert_includes response.body, "errors/show"
  end

  test "shows unprocessable entity page" do
    get "/errors/422"

    assert_response :unprocessable_entity
    assert_includes response.body, "errors/show"
  end

  test "shows internal server error page" do
    get "/errors/500"

    assert_response :internal_server_error
    assert_includes response.body, "errors/show"
  end
end
