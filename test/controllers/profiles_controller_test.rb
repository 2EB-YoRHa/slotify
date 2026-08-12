require "test_helper"

class ProfilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization
    @member = create_user(
      organization: @organization,
      role_name: "member",
      name: "Member User"
    )
  end

  test "user can view profile" do
    sign_in @member

    get profile_path

    assert_response :success
  end

  test "user can update name without current password" do
    sign_in @member

    patch profile_path,
          params: {
            user: {
              name: "Updated Member",
              email: @member.email
            }
          }

    assert_redirected_to profile_path

    @member.reload

    assert_equal "Updated Member", @member.name
  end

  test "email change requires current password" do
    sign_in @member

    original_email = @member.email

    patch profile_path,
          params: {
            user: {
              name: @member.name,
              email: "updated-member@slotify.test",
              current_password: ""
            }
          }

    assert_response :unprocessable_entity

    @member.reload

    assert_equal original_email, @member.email
  end

  test "user can request email change with current password" do
    sign_in @member

    original_email = @member.email

    assert_difference "ActionMailer::Base.deliveries.count", 1 do
      patch profile_path,
            params: {
              user: {
                name: @member.name,
                email: "updated-member@slotify.test",
                current_password: "Password123!"
              }
            }
    end

    assert_redirected_to profile_path

    @member.reload

    assert_equal original_email, @member.email
    assert_equal "updated-member@slotify.test", @member.unconfirmed_email
  end

  test "password change requires valid current password" do
    sign_in @member

    patch profile_path,
          params: {
            user: {
              name: @member.name,
              email: @member.email,
              current_password: "WrongPassword123!",
              password: "NewPassword123!",
              password_confirmation: "NewPassword123!"
            }
          }

    assert_response :unprocessable_entity

    @member.reload

    assert @member.valid_password?("Password123!")
  end

  test "user can change password with current password" do
    sign_in @member

    patch profile_path,
          params: {
            user: {
              name: @member.name,
              email: @member.email,
              current_password: "Password123!",
              password: "NewPassword123!",
              password_confirmation: "NewPassword123!"
            }
          }

    assert_redirected_to profile_path

    @member.reload

    assert @member.valid_password?("NewPassword123!")
  end

  test "user can upload avatar" do
    sign_in @member

    patch profile_path,
          params: {
            user: {
              name: @member.name,
              email: @member.email,
              avatar: uploaded_test_image
            }
          }

    assert_redirected_to profile_path

    @member.reload

    assert @member.avatar.attached?
  end

  test "email change stores pending email until confirmation" do
  sign_in @member

  patch profile_path,
        params: {
          user: {
            name: @member.name,
            email: "pending-email@slotify.test",
            current_password: "Password123!"
          }
        }

  assert_redirected_to profile_path

  @member.reload

  assert_not_equal "pending-email@slotify.test", @member.email
  assert_equal "pending-email@slotify.test", @member.unconfirmed_email
  end
end
