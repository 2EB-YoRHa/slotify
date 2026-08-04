require "test_helper"

class AmenityValidationTest < ActiveSupport::TestCase
  test "requires name" do
    amenity = Amenity.new(name: "")

    assert_not amenity.valid?
    assert_includes amenity.errors[:name], "can't be blank"
  end

  test "requires name with minimum length" do
    amenity = Amenity.new(name: "A")

    assert_not amenity.valid?
    assert_includes amenity.errors[:name],
                    "is too short (minimum is 2 characters)"
  end

  test "rejects name longer than sixty characters" do
    amenity = Amenity.new(name: "a" * 61)

    assert_not amenity.valid?
    assert_includes amenity.errors[:name],
                    "is too long (maximum is 60 characters)"
  end

  test "rejects duplicated name case insensitive" do
    Amenity.create!(name: "Projector")

    amenity = Amenity.new(name: "projector")

    assert_not amenity.valid?
    assert_includes amenity.errors[:name], "has already been taken"
  end

  test "normalizes name before validation" do
    amenity = Amenity.create!(name: "  Whiteboard  ")

    assert_equal "Whiteboard", amenity.name
  end
end
