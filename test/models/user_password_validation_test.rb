require "test_helper"

class UserPasswordValidationTest < ActiveSupport::TestCase
  setup do
    @organization = create_organization
    @role = create_role(name: "member")
  end

  test "accepts strong password" do
    user = build_user_with_password("Password123!")

    assert user.valid?
  end

  test "rejects password without uppercase letter" do
    user = build_user_with_password("password123!")

    assert_not user.valid?
    assert_includes user.errors[:password],
                    "must include at least one uppercase letter"
  end

  test "rejects password without lowercase letter" do
    user = build_user_with_password("PASSWORD123!")

    assert_not user.valid?
    assert_includes user.errors[:password],
                    "must include at least one lowercase letter"
  end

  test "rejects password without number" do
    user = build_user_with_password("Password!")

    assert_not user.valid?
    assert_includes user.errors[:password],
                    "must include at least one number"
  end

  test "rejects password without symbol" do
    user = build_user_with_password("Password123")

    assert_not user.valid?
    assert_includes user.errors[:password],
                    "must include at least one symbol"
  end

  private

  def build_user_with_password(password)
    User.new(
      organization: @organization,
      role: @role,
      name: unique_value("User"),
      email: "#{unique_value("user")}@slotify.test",
      password: password,
      password_confirmation: password,
      active: true
    )
  end
end
