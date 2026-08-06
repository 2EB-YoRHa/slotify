ENV["RAILS_ENV"] ||= "test"

require_relative "../config/environment"
require "rails/test_help"
require "securerandom"
require "base64"
require "rack/test"
require "tempfile"

module ActiveSupport
  class TestCase
    parallelize(workers: 1)

    include ActiveSupport::Testing::TimeHelpers

    def unique_value(prefix)
      "#{prefix}-#{SecureRandom.hex(6)}"
    end

    def create_role(name:)
      Role.find_or_create_by!(name: name)
    end

    def create_organization(name: nil)
      Organization.create!(
        name: name || unique_value("Organization"),
        slug: unique_value("organization"),
        email: "#{unique_value("organization")}@slotify.test",
        phone: "2222-2222",
        address: "San José, Costa Rica"
      )
    end

    def create_user(organization:, role_name:, name: nil, active: true)
      role = create_role(name: role_name)

      User.create!(
        organization: organization,
        role: role,
        name: name || unique_value(role_name),
        email: "#{unique_value(role_name)}@slotify.test",
        password: "Password123!",
        password_confirmation: "Password123!",
        active: active
      )
    end

    def create_booking_rule(
      organization:,
      max_hours_per_reservation: 4,
      min_notice_minutes: 0,
      cancellation_limit_hours: 1,
      allow_weekend_bookings: true,
      ensure_active_subscription: true
    )
      if ensure_active_subscription && organization.active_subscription.blank?
        create_subscription(
          organization: organization,
          plan_name: "starter",
          status: "active",
          stripe_subscription_id: "sub_test_#{SecureRandom.hex(8)}"
        )

        organization.reload
      end

      organization.booking_rule&.destroy!

      organization.create_booking_rule!(
        max_hours_per_reservation: max_hours_per_reservation,
        min_notice_minutes: min_notice_minutes,
        cancellation_limit_hours: cancellation_limit_hours,
        allow_weekend_bookings: allow_weekend_bookings
      )
    end

    def create_subscription(
      organization:,
      plan_name: "starter",
      status: "active",
      stripe_subscription_id: nil,
      stripe_price_id: nil,
      stripe_checkout_session_id: nil,
      workspace_limit: :catalog,
      user_limit: :catalog
      )
      plan = SubscriptionPlan.find!(plan_name)

      workspace_limit = plan[:workspace_limit] if workspace_limit == :catalog
      user_limit = plan[:user_limit] if user_limit == :catalog

      organization.subscriptions.create!(
        plan_name: plan_name,
        status: status,
        starts_at: Time.current,
        ends_at: nil,
        workspace_limit: workspace_limit,
        user_limit: user_limit,
        stripe_subscription_id: stripe_subscription_id,
        stripe_price_id: stripe_price_id,
        stripe_checkout_session_id: stripe_checkout_session_id
      )
    end

    def create_invitation(
      organization:,
      invited_by:,
      role_name: "member",
      email: nil,
      status: "pending"
    )
      role = create_role(name: role_name)

      organization.organization_invitations.create!(
        email: email || "#{unique_value("invite")}@slotify.test",
        invited_by: invited_by,
        role: role,
        status: status
      )
    end

    def create_workspace(
      organization:,
      name: nil,
      capacity: 4,
      active: true,
      hourly_rate: 25.0
    )
      organization.workspaces.create!(
        name: name || unique_value("Workspace"),
        workspace_type: "meeting_room",
        capacity: capacity,
        floor: "2",
        zone: "North",
        location: "Main Building",
        description: "Test workspace",
        hourly_rate: hourly_rate,
        active: active
      )
    end

    def uploaded_test_image(filename: "test-image.png", content_type: "image/png")
        png_1x1 = Base64.decode64(
          "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="
        )

        file = Tempfile.new(
          [
            File.basename(filename, File.extname(filename)),
            File.extname(filename)
          ],
          binmode: true
        )

        file.write(png_1x1)
        file.rewind

        Rack::Test::UploadedFile.new(
          file.path,
          content_type,
          original_filename: filename
        )
    end

    def create_reservation(
      organization:,
      user:,
      workspace:,
      start_time: nil,
      end_time: nil,
      status: "confirmed",
      attendees_count: 1
    )
      start_time ||= next_weekday_time(hour: 10)
      end_time ||= start_time + 1.hour

      organization.reservations.create!(
        user: user,
        workspace: workspace,
        start_time: start_time,
        end_time: end_time,
        status: status,
        attendees_count: attendees_count,
        notes: "Test reservation"
      )
    end

    def next_weekday_time(hour:, minute: 0, minimum_notice_minutes: 120)
      date = Time.zone.today

      loop do
        candidate = Time.zone.local(date.year, date.month, date.day, hour, minute)
        minimum_start_time = Time.current + minimum_notice_minutes.minutes

        return candidate if candidate >= minimum_start_time &&
                            !candidate.saturday? &&
                            !candidate.sunday?

        date += 1.day
      end
    end

    def datetime_param(value)
      value.strftime("%Y-%m-%dT%H:%M")
    end
  end
end

class ActionDispatch::IntegrationTest
  include Devise::Test::IntegrationHelpers
end
