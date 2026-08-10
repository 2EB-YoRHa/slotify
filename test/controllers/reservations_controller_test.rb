require "test_helper"

class ReservationsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @organization = create_organization

    create_subscription(
      organization: @organization,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: "sub_reservations_starter"
    )

    @manager = create_user(
      organization: @organization,
      role_name: "manager"
    )

    @member = create_user(
      organization: @organization,
      role_name: "member"
    )

    @workspace = create_workspace(
      organization: @organization,
      capacity: 4,
      active: true
    )

    create_booking_rule(
      organization: @organization,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      allow_weekend_bookings: true
    )
  end

  test "manager can view reservations index" do
    sign_in @manager

    get reservations_path

    assert_response :success
  end

  test "member is redirected from reservations index to my bookings" do
    sign_in @member

    get reservations_path

    assert_redirected_to my_reservations_path
  end

  test "member can open new reservation page" do
    sign_in @member

    get new_reservation_path

    assert_response :success
  end

  test "member can create reservation" do
    sign_in @member

    start_time = next_weekday_time(hour: 14)

    assert_difference "Reservation.count", 1 do
      post reservations_path,
           params: {
             reservation: {
               workspace_id: @workspace.id,
               start_time: datetime_param(start_time),
               end_time: datetime_param(start_time + 1.hour),
               attendees_count: 2,
               notes: "Created from controller test"
             }
           }
    end

    reservation = Reservation.order(:created_at).last

    assert_redirected_to reservation_path(reservation)

    assert_equal @member, reservation.user
    assert_equal @workspace, reservation.workspace
    assert_equal "confirmed", reservation.status
  end

  test "member can edit own reservation" do
    sign_in @member

    reservation = create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace
    )

    new_start_time = next_weekday_time(hour: 15)

    patch reservation_path(reservation),
          params: {
            reservation: {
              workspace_id: @workspace.id,
              start_time: datetime_param(new_start_time),
              end_time: datetime_param(new_start_time + 1.hour),
              attendees_count: 3,
              notes: "Updated by member"
            }
          }

    assert_redirected_to reservation_path(reservation)

    reservation.reload

    assert_equal 3, reservation.attendees_count
    assert_equal "Updated by member", reservation.notes
  end

  test "availability returns unavailable workspace ids" do
    sign_in @manager

    start_time = next_weekday_time(hour: 10)

    create_reservation(
      organization: @organization,
      user: @member,
      workspace: @workspace,
      start_time: start_time,
      end_time: start_time + 1.hour
    )

    get "/reservations/availability",
        params: {
          start_time: datetime_param(start_time + 30.minutes),
          end_time: datetime_param(start_time + 90.minutes)
        },
        as: :json

    assert_response :success

    body = JSON.parse(response.body)

    assert_includes body["unavailable_workspace_ids"], @workspace.id
  end
end
