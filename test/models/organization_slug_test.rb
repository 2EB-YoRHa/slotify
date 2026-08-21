require "test_helper"

class OrganizationSlugTest < ActiveSupport::TestCase
  test "generates slug from organization name when slug is blank" do
    organization = Organization.create!(
      name: "Main Coworking Costa Rica",
      email: "main@slotify.test"
    )

    assert_equal "main-coworking-costa-rica", organization.slug
  end

  test "normalizes custom slug" do
    organization = Organization.create!(
      name: "Atenas Workspace",
      slug: "Atenas Workspace CR",
      email: "atenas@slotify.test"
    )

    assert_equal "atenas-workspace-cr", organization.slug
  end

  test "generates unique slug when slug already exists" do
    Organization.create!(
      name: "Sky Offices",
      slug: "sky-offices",
      email: "sky-one@slotify.test"
    )

    second_organization = Organization.create!(
      name: "Sky Offices",
      slug: "sky-offices",
      email: "sky-two@slotify.test"
    )

    assert_equal "sky-offices-2", second_organization.slug
  end

  test "keeps existing slug when updating organization name" do
    organization = Organization.create!(
      name: "Original Workspace",
      slug: "original-workspace",
      email: "original@slotify.test"
    )

    organization.update!(name: "Updated Workspace")

    assert_equal "original-workspace", organization.slug
  end

  test "generates slug from updated slug value" do
    organization = Organization.create!(
      name: "Original Workspace",
      slug: "original-workspace",
      email: "updated-slug@slotify.test"
    )

    organization.update!(slug: "New Custom Slug")

    assert_equal "new-custom-slug", organization.slug
  end
end
