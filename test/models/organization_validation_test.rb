require "test_helper"

class OrganizationValidationTest < ActiveSupport::TestCase
  test "requires name with minimum length" do
    organization = Organization.new(
      name: "AB",
      email: "contact@slotify.test"
    )

    assert_not organization.valid?
    assert_includes organization.errors[:name],
                    "is too short (minimum is 3 characters)"
  end

  test "rejects invalid email" do
    organization = Organization.new(
      name: "Valid Organization",
      email: "invalid-email"
    )

    assert_not organization.valid?
    assert_includes organization.errors[:email], "is invalid"
  end

  test "rejects invalid phone characters" do
    organization = Organization.new(
      name: "Valid Organization",
      email: "contact@slotify.test",
      phone: "phone-number-abc"
    )

    assert_not organization.valid?
    assert_includes organization.errors[:phone],
                    "can only include numbers, spaces, +, -, parentheses, and dots"
  end

  test "normalizes contact fields" do
    organization = Organization.create!(
      name: "  Valid Organization  ",
      email: "  CONTACT@SLOTIFY.TEST  ",
      phone: "  +506 2222-2222  ",
      address: "  Main address  "
    )

    assert_equal "Valid Organization", organization.name
    assert_equal "contact@slotify.test", organization.email
    assert_equal "+506 2222-2222", organization.phone
    assert_equal "Main address", organization.address
  end

  test "rejects address longer than two hundred characters" do
    organization = Organization.new(
      name: "Valid Organization",
      address: "a" * 201
    )

    assert_not organization.valid?
    assert_includes organization.errors[:address],
                    "is too long (maximum is 200 characters)"
  end
end
