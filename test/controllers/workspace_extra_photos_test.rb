require "test_helper"

class WorkspaceExtraPhotosTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

    create_role(name: "manager")

    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )
  end

  test "starter cannot create workspace with extra photos" do
    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_starter_extra_photos_blocked"
    )

    sign_in @manager

    assert_no_difference "Workspace.count" do
      post workspaces_path,
           params: {
             workspace: valid_workspace_params.merge(
               extra_photos: [
                 uploaded_test_image(filename: "extra-starter.png")
               ]
             )
           }
    end

    assert_response :unprocessable_entity

    assert_includes response.body,
                    "Extra gallery photos are only available on the Pro plan"
  end

  test "pro can create workspace with extra photos" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_extra_photos_allowed",
      workspace_limit: nil,
      user_limit: nil
    )

    sign_in @manager

    assert_difference "Workspace.count", 1 do
      post workspaces_path,
           params: {
             workspace: valid_workspace_params.merge(
               extra_photos: [
                 uploaded_test_image(filename: "extra-pro-1.png"),
                 uploaded_test_image(filename: "extra-pro-2.png")
               ]
             )
           }
    end

    workspace = Workspace.order(:created_at).last

    assert_redirected_to workspaces_path
    assert_equal 2, workspace.extra_photos.attachments.count
  end

  test "pro appends extra photos when updating workspace" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_extra_photos_append",
      workspace_limit: nil,
      user_limit: nil
    )

    workspace = create_workspace(
      organization: @organization,
      name: "Gallery Workspace"
    )

    workspace.extra_photos.attach(
      uploaded_test_image(filename: "existing-extra.png")
    )

    assert_equal 1, workspace.extra_photos.attachments.count

    sign_in @manager

    patch workspace_path(workspace),
          params: {
            workspace: valid_workspace_params.merge(
              name: "Updated Gallery Workspace",
              extra_photos: [
                uploaded_test_image(filename: "new-extra-1.png"),
                uploaded_test_image(filename: "new-extra-2.png")
              ]
            )
          }

    assert_redirected_to workspaces_path

    workspace.reload

    assert_equal "Updated Gallery Workspace", workspace.name
    assert_equal 3, workspace.extra_photos.attachments.count
  end

  test "pro does not remove main photo when adding extra photos" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_main_photo_preserved",
      workspace_limit: nil,
      user_limit: nil
    )

    workspace = create_workspace(
      organization: @organization,
      name: "Main Photo Workspace"
    )

    workspace.photo.attach(
      uploaded_test_image(filename: "main-photo.png")
    )

    assert workspace.photo.attached?

    sign_in @manager

    patch workspace_path(workspace),
          params: {
            workspace: valid_workspace_params.merge(
              name: "Main Photo Still Exists",
              extra_photos: [
                uploaded_test_image(filename: "extra-photo.png")
              ]
            )
          }

    assert_redirected_to workspaces_path

    workspace.reload

    assert workspace.photo.attached?
    assert_equal 1, workspace.extra_photos.attachments.count
  end

  test "pro cannot exceed five extra photos" do
    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_pro_extra_photos_limit",
      workspace_limit: nil,
      user_limit: nil
    )

    workspace = create_workspace(
      organization: @organization,
      name: "Limited Gallery Workspace"
    )

    5.times do |index|
      workspace.extra_photos.attach(
        uploaded_test_image(filename: "existing-extra-#{index}.png")
      )
    end

    assert_equal 5, workspace.extra_photos.attachments.count

    sign_in @manager

    patch workspace_path(workspace),
          params: {
            workspace: valid_workspace_params.merge(
              name: "Should Not Add More",
              extra_photos: [
                uploaded_test_image(filename: "blocked-extra.png")
              ]
            )
          }

    assert_response :unprocessable_entity

    workspace.reload

    assert_equal 5, workspace.extra_photos.attachments.count
  end

  private

  def valid_workspace_params
    {
      name: "Test Workspace",
      workspace_type: "meeting_room",
      capacity: 8,
      floor: "2",
      zone: "North",
      location: "Main Building",
      description: "Workspace used for extra photo tests",
      hourly_rate: 25,
      active: true,
      amenity_ids: []
    }
  end
end
