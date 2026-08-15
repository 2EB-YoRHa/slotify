require "test_helper"

class MultiTenantIsolationTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization(name: "Primary Coworking")
    @other_organization = create_organization(name: "Other Coworking")

    create_subscription(
      organization: @organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_primary_isolation"
    )

    create_subscription(
      organization: @other_organization,
      plan_name: "pro",
      status: "active",
      stripe_subscription_id: "sub_other_isolation"
    )

    @manager = create_user(
      organization: @organization,
      role_name: "manager",
      name: "Primary Manager"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member",
      name: "Primary Member"
    )

    @other_manager = create_user(
      organization: @other_organization,
      role_name: "manager",
      name: "Other Manager"
    )

    @other_member = create_user(
      organization: @other_organization,
      role_name: "member",
      name: "Other Member"
    )

    @workspace = create_workspace(
      organization: @organization,
      name: "Primary Workspace",
      active: true
    )

    @other_workspace = create_workspace(
      organization: @other_organization,
      name: "Other Workspace",
      active: true
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )

    create_booking_rule(
      organization: @other_organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )

    @start_time = next_weekday_time(hour: 13)

    @other_reservation = create_reservation(
      organization: @other_organization,
      user: @other_member,
      workspace: @other_workspace,
      start_time: @start_time,
      end_time: @start_time + 1.hour
    )
  end

  test "workspaces index only returns current organization workspaces" do
    sign_in @manager

    get workspaces_path, as: :json

    assert_response :success

    workspace_ids = JSON.parse(response.body).map { |workspace| workspace["id"] }

    assert_includes workspace_ids, @workspace.id
    assert_not_includes workspace_ids, @other_workspace.id
  end

  test "manager cannot open workspace from another organization" do
    sign_in @manager

    get workspace_path(@other_workspace)

    assert_response :not_found
  end

  test "member cannot open reservation from another organization" do
    sign_in @member

    get reservation_path(@other_reservation)

    assert_response :not_found
  end

  test "member cannot create reservation using workspace from another organization" do
    sign_in @member

    reservation_start_time = next_weekday_time(hour: 15)

    assert_no_difference "Reservation.count" do
      post reservations_path,
           params: {
             reservation: {
               workspace_id: @other_workspace.id,
               start_time: datetime_param(reservation_start_time),
               end_time: datetime_param(reservation_start_time + 1.hour),
               attendees_count: 1,
               notes: "Cross organization attempt"
             }
           },
           as: :json
    end

    assert_response :unprocessable_entity

    body = JSON.parse(response.body)

    assert body["errors"].join.include?(
      "Workspace must belong to your organization and be active"
    )
  end

  test "availability does not expose unavailable workspace ids from another organization" do
    sign_in @manager

    own_reservation = create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: @start_time,
      end_time: @start_time + 1.hour
    )

    get "/reservations/availability",
        params: {
          start_time: datetime_param(@start_time + 15.minutes),
          end_time: datetime_param(@start_time + 45.minutes)
        },
        as: :json

    assert_response :success

    body = JSON.parse(response.body)
    unavailable_workspace_ids = body["unavailable_workspace_ids"]

    assert_includes unavailable_workspace_ids, own_reservation.workspace_id
    assert_not_includes unavailable_workspace_ids, @other_workspace.id
  end

  test "manager cannot open member from another organization" do
    sign_in @manager

    get organization_member_path(@other_member)

    assert_response :not_found
  end

  test "manager cannot delete invitation from another organization" do
    invitation = create_invitation(
      organization: @other_organization,
      invited_by: @other_manager,
      role_name: "member",
      email: "outside-member@slotify.test"
    )

    sign_in @manager

    assert_no_difference "OrganizationInvitation.count" do
      delete organization_invitation_path(invitation)
    end

    assert_response :not_found
  end
end
