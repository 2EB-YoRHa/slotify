require "test_helper"

class PasswordSettingsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )
  end

  test "user can change password with current password" do
    sign_in @member

    patch password_settings_path,
          params: {
            user: {
              current_password: "Password123!",
              password: "NewPassword123!",
              password_confirmation: "NewPassword123!"
            }
          }

    assert_redirected_to security_path

    @member.reload

    assert @member.valid_password?("NewPassword123!")
  end

  test "password change requires valid current password" do
    sign_in @member

    patch password_settings_path,
          params: {
            user: {
              current_password: "WrongPassword123!",
              password: "NewPassword123!",
              password_confirmation: "NewPassword123!"
            }
          }

    assert_response :unprocessable_entity

    @member.reload

    assert @member.valid_password?("Password123!")
    assert_not @member.valid_password?("NewPassword123!")
  end

  test "password change requires matching confirmation" do
    sign_in @member

    patch password_settings_path,
          params: {
            user: {
              current_password: "Password123!",
              password: "NewPassword123!",
              password_confirmation: "DifferentPassword123!"
            }
          }

    assert_response :unprocessable_entity

    @member.reload

    assert @member.valid_password?("Password123!")
    assert_not @member.valid_password?("NewPassword123!")
  end

  test "password change requires strong password" do
    sign_in @member

    patch password_settings_path,
          params: {
            user: {
              current_password: "Password123!",
              password: "weak",
              password_confirmation: "weak"
            }
          }

    assert_response :unprocessable_entity

    @member.reload

    assert @member.valid_password?("Password123!")
    assert_not @member.valid_password?("weak")
  end
end
