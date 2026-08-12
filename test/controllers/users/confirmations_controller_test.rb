require "test_helper"

class Users::ConfirmationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization
    @role = create_role(name: "manager")
  end

  test "new confirmation page renders" do
    get new_user_confirmation_path

    assert_response :success
  end

  test "sign up creates unconfirmed account and sends confirmation email" do
    assert_difference "User.count", 1 do
      assert_difference "ActionMailer::Base.deliveries.count", 1 do
        post user_registration_path,
             params: {
               user: {
                 name: "New Manager",
                 email: "new-manager@slotify.test",
                 password: "Password123!",
                 password_confirmation: "Password123!",
                 organization_name: "New Organization"
               }
             }
      end
    end

    user = User.find_by!(email: "new-manager@slotify.test")

    assert_not user.confirmed?
    assert_redirected_to new_user_session_path
  end

  test "unconfirmed user cannot sign in and is redirected to confirmation required page" do
    user = User.create!(
      organization: @organization,
      role: @role,
      name: "Unconfirmed Manager",
      email: "unconfirmed@slotify.test",
      password: "Password123!",
      password_confirmation: "Password123!",
      active: true
    )

    post user_session_path,
        params: {
          user: {
            email: user.email,
            password: "Password123!"
          }
        }

    assert_redirected_to user_confirmation_required_path
  end

  test "inactive user is redirected to inactive account page" do
    user = User.create!(
      organization: @organization,
      role: @role,
      name: "Inactive Manager",
      email: "inactive@slotify.test",
      password: "Password123!",
      password_confirmation: "Password123!",
      active: false,
      confirmed_at: Time.current
    )

    post user_session_path,
        params: {
          user: {
            email: user.email,
            password: "Password123!"
          }
        }

    assert_redirected_to user_inactive_account_path
  end

  test "invited member receives confirmation email after creating account" do
    member_role = create_role(name: "member")

    invitation = OrganizationInvitation.create!(
      organization: @organization,
      role: member_role,
      invited_by: User.create!(
        organization: @organization,
        role: @role,
        name: "Inviter",
        email: "inviter@slotify.test",
        password: "Password123!",
        password_confirmation: "Password123!",
        active: true,
        confirmed_at: Time.current
      ),
      email: "invited-member@slotify.test",
      token: SecureRandom.hex(20),
      status: "pending",
      expires_at: 7.days.from_now
    )

    assert_difference "User.count", 1 do
      assert_difference "ActionMailer::Base.deliveries.count", 1 do
        post user_registration_path,
            params: {
              user: {
                name: "Invited Member",
                email: invitation.email,
                password: "Password123!",
                password_confirmation: "Password123!",
                invitation_token: invitation.token
              }
            }
      end
    end

    user = User.find_by!(email: invitation.email)

    assert_not user.confirmed?
    assert_redirected_to new_user_session_path
  end

  test "confirmed user can sign in" do
    user = User.create!(
      organization: @organization,
      role: @role,
      name: "Confirmed Manager",
      email: "confirmed@slotify.test",
      password: "Password123!",
      password_confirmation: "Password123!",
      active: true,
      confirmed_at: Time.current
    )

    post user_session_path,
         params: {
           user: {
             email: user.email,
             password: "Password123!"
           }
         }

    assert_redirected_to subscription_path
  end

  test "confirmation required page renders" do
    get user_confirmation_required_path

    assert_response :success
  end

  test "inactive account page renders" do
    get user_inactive_account_path

    assert_response :success
  end
end
