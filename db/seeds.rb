# Demo seed data for Slotify.
# This file resets the database and creates a complete presentation environment.
# Use only on local/demo databases.

require "stringio"
require "zlib"

PASSWORD = "Password123!"

puts "Cleaning database..."

ActiveStorage::VariantRecord.delete_all if defined?(ActiveStorage::VariantRecord)
ActiveStorage::Attachment.delete_all
ActiveStorage::Blob.delete_all

Payment.delete_all
Reservation.delete_all
BookingTimeSlot.delete_all
BookingRule.delete_all
WorkspaceAmenity.delete_all
OrganizationInvitation.delete_all
Subscription.delete_all
Workspace.delete_all
User.delete_all
Organization.delete_all
Amenity.delete_all
Role.delete_all

puts "Creating roles..."

roles = {
  admin: Role.create!(name: "admin"),
  manager: Role.create!(name: "manager"),
  member: Role.create!(name: "member")
}

puts "Creating amenities..."

amenities = [
  "High-Speed WiFi",
  "Air Conditioning",
  "Whiteboard",
  "TV Screen",
  "Video Conference",
  "Coffee Station",
  "Natural Light",
  "Private Entrance",
  "Standing Desk",
  "Printer Access",
  "Soundproofing",
  "Projector",
  "Ergonomic Chairs",
  "Phone Booth Access",
  "Reception Support",
  "Parking Access"
].index_with { |name| Amenity.create!(name: name) }

# -----------------------------------------------------------------------------
# Helpers
# -----------------------------------------------------------------------------

def create_organization!(name:, slug:, email:, phone:, address:)
  Organization.create!(
    name: name,
    slug: slug,
    email: email,
    phone: phone,
    address: address
  )
end

def create_user!(organization:, role:, name:, email:, active: true, confirmed: true)
  User.create!(
    organization: organization,
    role: role,
    name: name,
    email: email,
    password: PASSWORD,
    password_confirmation: PASSWORD,
    active: active,
    confirmed_at: confirmed ? Time.current : nil
  )
end

def create_subscription!(organization:, plan_name:, status: "active")
  plan = SubscriptionPlan.find!(plan_name)

  subscription = Subscription.create!(
    organization: organization,
    plan_name: plan_name,
    status: status,
    starts_at: 14.days.ago,
    ends_at: 60.days.from_now,
    workspace_limit: plan[:workspace_limit],
    user_limit: plan[:user_limit],
    stripe_subscription_id: "sub_demo_#{organization.slug}_#{plan_name}",
    stripe_price_id: "price_demo_#{plan_name}"
  )

  Payment.create!(
    subscription: subscription,
    amount: plan[:amount_cents].to_i / 100.0,
    currency: "USD",
    status: "paid",
    payment_provider: "demo",
    provider_payment_id: "pay_demo_#{organization.slug}_#{plan_name}",
    paid_at: 13.days.ago
  )

  subscription
end

def create_booking_rule!(organization:, max_hours:, min_notice:, cancellation_limit:, weekends:)
  BookingRule.create!(
    organization: organization,
    max_hours_per_reservation: max_hours,
    min_notice_minutes: min_notice,
    cancellation_limit_hours: cancellation_limit,
    allow_weekend_bookings: weekends
  )
end

def create_workspace!(organization:, name:, workspace_type:, capacity:, floor:, zone:, location:, description:, hourly_rate:, active:, amenities:)
  workspace = Workspace.create!(
    organization: organization,
    name: name,
    workspace_type: workspace_type,
    capacity: capacity,
    floor: floor,
    zone: zone,
    location: location,
    description: description,
    hourly_rate: hourly_rate,
    active: active
  )

  workspace.amenities = amenities.compact
  workspace.save!
  workspace
end

def create_time_slot!(organization:, name:, start_hour:, end_hour:, days:, active: true)
  BookingTimeSlot.create!(
    organization: organization,
    name: name,
    start_minute: start_hour * 60,
    end_minute: end_hour * 60,
    days_of_week: Array(days).join(","),
    active: active
  )
end

def create_reservation!(organization:, user:, workspace:, start_time:, end_time:, status: "confirmed", attendees_count: 1, notes: nil, validate: true)
  reservation = Reservation.new(
    organization: organization,
    user: user,
    workspace: workspace,
    start_time: start_time,
    end_time: end_time,
    status: status,
    attendees_count: attendees_count,
    notes: notes
  )

  validate ? reservation.save! : reservation.save!(validate: false)
  reservation
end

def next_weekday_time(hour:, minute: 0, days_from_now: 1)
  date = Time.zone.today + days_from_now.days

  loop do
    candidate = Time.zone.local(date.year, date.month, date.day, hour, minute)
    return candidate if candidate.future? && !candidate.saturday? && !candidate.sunday?

    date += 1.day
  end
end

def next_saturday_time(hour:, minute: 0, days_from_now: 1)
  date = Time.zone.today + days_from_now.days

  loop do
    candidate = Time.zone.local(date.year, date.month, date.day, hour, minute)
    return candidate if candidate.future? && candidate.saturday?

    date += 1.day
  end
end

def previous_weekday_time(hour:, minute: 0, days_ago: 3)
  date = Time.zone.today - days_ago.days

  loop do
    candidate = Time.zone.local(date.year, date.month, date.day, hour, minute)
    return candidate unless candidate.saturday? || candidate.sunday?

    date -= 1.day
  end
end

def hex_to_rgb(hex)
  normalized = hex.delete("#")

  [
    normalized[0..1].to_i(16),
    normalized[2..3].to_i(16),
    normalized[4..5].to_i(16)
  ]
end

def png_chunk(type, data)
  [ data.bytesize ].pack("N") + type + data + [ Zlib.crc32(type + data) ].pack("N")
end

def demo_png_bytes(width:, height:, from:, to:)
  from_rgb = hex_to_rgb(from)
  to_rgb = hex_to_rgb(to)
  raw = +"".b

  height.times do |y|
    raw << 0

    width.times do |x|
      ratio = ((x.to_f / [ width - 1, 1 ].max) * 0.68) +
              ((y.to_f / [ height - 1, 1 ].max) * 0.32)

      r = (from_rgb[0] + ((to_rgb[0] - from_rgb[0]) * ratio)).round
      g = (from_rgb[1] + ((to_rgb[1] - from_rgb[1]) * ratio)).round
      b = (from_rgb[2] + ((to_rgb[2] - from_rgb[2]) * ratio)).round

      if ((x + y) / 96).even?
        r = [ r + 10, 255 ].min
        g = [ g + 10, 255 ].min
        b = [ b + 10, 255 ].min
      end

      raw << r << g << b
    end
  end

  +"\x89PNG\r\n\x1a\n".b +
    png_chunk("IHDR", [ width, height, 8, 2, 0, 0, 0 ].pack("NNCCCCC")) +
    png_chunk("IDAT", Zlib.deflate(raw)) +
    png_chunk("IEND", "")
end

def attach_demo_png!(record, attachment_name, filename:, from:, to:, width: 960, height: 640)
  record.public_send(attachment_name).attach(
    io: StringIO.new(
      demo_png_bytes(
        width: width,
        height: height,
        from: from,
        to: to
      )
    ),
    filename: filename,
    content_type: "image/png"
  )
end

def attach_workspace_gallery!(workspace, palette)
  attach_demo_png!(
    workspace,
    :photo,
    filename: "#{workspace.name.parameterize}-main.png",
    from: palette[:main][0],
    to: palette[:main][1]
  )

  Array(palette[:extra]).each_with_index do |colors, index|
    workspace.extra_photos.attach(
      io: StringIO.new(
        demo_png_bytes(
          width: 960,
          height: 640,
          from: colors[0],
          to: colors[1]
        )
      ),
      filename: "#{workspace.name.parameterize}-gallery-#{index + 1}.png",
      content_type: "image/png"
    )
  end
end

def attach_avatar!(user, from:, to:)
  attach_demo_png!(
    user,
    :avatar,
    filename: "#{user.name.parameterize}-avatar.png",
    from: from,
    to: to,
    width: 256,
    height: 256
  )
end

# -----------------------------------------------------------------------------
# Organizations, subscriptions and rules
# -----------------------------------------------------------------------------

puts "Creating organizations..."

pro_org = create_organization!(
  name: "Astra Coworking",
  slug: "astra-coworking",
  email: "hello@astra-coworking.test",
  phone: "+1 555 0100",
  address: "Austin, Texas"
)

starter_org = create_organization!(
  name: "Northstar Studio",
  slug: "northstar-studio",
  email: "hello@northstar-studio.test",
  phone: "+1 555 0200",
  address: "Denver, Colorado"
)

puts "Creating subscriptions..."

create_subscription!(organization: pro_org, plan_name: "pro")
create_subscription!(organization: starter_org, plan_name: "starter")

puts "Creating booking rules..."

create_booking_rule!(
  organization: pro_org,
  max_hours: 12,
  min_notice: 0,
  cancellation_limit: 72,
  weekends: true
)

create_booking_rule!(
  organization: starter_org,
  max_hours: 4,
  min_notice: 0,
  cancellation_limit: 24,
  weekends: false
)

# -----------------------------------------------------------------------------
# Users
# -----------------------------------------------------------------------------

puts "Creating users..."

pro_manager = create_user!(
  organization: pro_org,
  role: roles[:manager],
  name: "Emily Carter",
  email: "manager@slotify.test"
)

pro_admin = create_user!(
  organization: pro_org,
  role: roles[:admin],
  name: "Michael Anderson",
  email: "admin@slotify.test"
)

pro_member = create_user!(
  organization: pro_org,
  role: roles[:member],
  name: "Sarah Mitchell",
  email: "member@slotify.test"
)

pro_member_two = create_user!(
  organization: pro_org,
  role: roles[:member],
  name: "James Parker",
  email: "james@slotify.test"
)

pro_member_three = create_user!(
  organization: pro_org,
  role: roles[:member],
  name: "Olivia Bennett",
  email: "olivia@slotify.test"
)

inactive_member = create_user!(
  organization: pro_org,
  role: roles[:member],
  name: "Ryan Brooks",
  email: "inactive-member@slotify.test",
  active: false
)

unconfirmed_member = create_user!(
  organization: pro_org,
  role: roles[:member],
  name: "Hannah Lewis",
  email: "unconfirmed-member@slotify.test",
  confirmed: false
)

starter_manager = create_user!(
  organization: starter_org,
  role: roles[:manager],
  name: "David Miller",
  email: "starter-manager@slotify.test"
)

starter_member = create_user!(
  organization: starter_org,
  role: roles[:member],
  name: "Megan Wilson",
  email: "starter-member@slotify.test"
)

puts "Attaching demo avatars..."

attach_avatar!(pro_manager, from: "#06B6D4", to: "#0F172A")
attach_avatar!(pro_admin, from: "#8B5CF6", to: "#1E1B4B")
attach_avatar!(pro_member, from: "#22C55E", to: "#064E3B")
attach_avatar!(pro_member_two, from: "#F97316", to: "#7C2D12")
attach_avatar!(pro_member_three, from: "#EC4899", to: "#831843")
attach_avatar!(inactive_member, from: "#94A3B8", to: "#334155")
attach_avatar!(starter_manager, from: "#14B8A6", to: "#134E4A")
attach_avatar!(starter_member, from: "#F59E0B", to: "#78350F")

# -----------------------------------------------------------------------------
# Workspaces
# -----------------------------------------------------------------------------

puts "Creating workspaces..."

focus_room = create_workspace!(
  organization: pro_org,
  name: "Focus Room",
  workspace_type: "private_office",
  capacity: 4,
  floor: "2nd",
  zone: "North Wing",
  location: "Building A - Level 2",
  description: "Private office for focused work, video calls, and small team sessions.",
  hourly_rate: 45,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"],
    amenities["Standing Desk"],
    amenities["Soundproofing"],
    amenities["Ergonomic Chairs"]
  ]
)

board_room = create_workspace!(
  organization: pro_org,
  name: "Board Room",
  workspace_type: "meeting_room",
  capacity: 12,
  floor: "3rd",
  zone: "Executive Area",
  location: "Building A - Level 3",
  description: "Executive meeting room with video conference, screen, whiteboard, and coffee station.",
  hourly_rate: 95,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["TV Screen"],
    amenities["Whiteboard"],
    amenities["Video Conference"],
    amenities["Coffee Station"],
    amenities["Reception Support"]
  ]
)

open_desk = create_workspace!(
  organization: pro_org,
  name: "Open Desk A",
  workspace_type: "open_desk",
  capacity: 1,
  floor: "1st",
  zone: "Open Area",
  location: "Main Floor - Desk Zone",
  description: "Flexible desk for individual work with quick access to common areas.",
  hourly_rate: 18,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"],
    amenities["Natural Light"],
    amenities["Printer Access"]
  ]
)

training_lab = create_workspace!(
  organization: pro_org,
  name: "Training Lab",
  workspace_type: "training_room",
  capacity: 24,
  floor: "4th",
  zone: "Learning Center",
  location: "Building B - Level 4",
  description: "Training room for workshops, onboarding sessions, and team events.",
  hourly_rate: 120,
  active: true,
  amenities: [
    amenities["Projector"],
    amenities["Whiteboard"],
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"],
    amenities["Parking Access"]
  ]
)

phone_booth = create_workspace!(
  organization: pro_org,
  name: "Phone Booth",
  workspace_type: "phone_booth",
  capacity: 1,
  floor: "2nd",
  zone: "Quiet Area",
  location: "Building A - Level 2",
  description: "Soundproof booth for private calls and short remote meetings.",
  hourly_rate: 12,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Soundproofing"],
    amenities["Phone Booth Access"]
  ]
)

inactive_workspace = create_workspace!(
  organization: pro_org,
  name: "Maintenance Office",
  workspace_type: "private_office",
  capacity: 2,
  floor: "1st",
  zone: "Service Area",
  location: "Back Office",
  description: "Inactive workspace used to demonstrate manager visibility and member restrictions.",
  hourly_rate: 25,
  active: false,
  amenities: [ amenities["High-Speed WiFi"] ]
)

starter_desk = create_workspace!(
  organization: starter_org,
  name: "Starter Desk",
  workspace_type: "open_desk",
  capacity: 1,
  floor: "1st",
  zone: "Main Area",
  location: "Northstar Studio - Main Floor",
  description: "Simple desk for individual reservations on the Starter plan.",
  hourly_rate: 15,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"]
  ]
)

starter_meeting = create_workspace!(
  organization: starter_org,
  name: "Starter Meeting Room",
  workspace_type: "meeting_room",
  capacity: 6,
  floor: "1st",
  zone: "Meeting Area",
  location: "Northstar Studio - Main Floor",
  description: "Small meeting room for Starter plan booking and workspace limit demos.",
  hourly_rate: 40,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Whiteboard"],
    amenities["TV Screen"]
  ]
)

starter_booth = create_workspace!(
  organization: starter_org,
  name: "Starter Call Booth",
  workspace_type: "phone_booth",
  capacity: 1,
  floor: "1st",
  zone: "Quiet Corner",
  location: "Northstar Studio - Main Floor",
  description: "Compact booth for calls and focused work.",
  hourly_rate: 10,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Soundproofing"]
  ]
)

puts "Attaching demo workspace photos..."

attach_workspace_gallery!(
  focus_room,
  main: [ "#06B6D4", "#0F172A" ],
  extra: [
    [ "#22D3EE", "#164E63" ],
    [ "#38BDF8", "#075985" ]
  ]
)

attach_workspace_gallery!(
  board_room,
  main: [ "#8B5CF6", "#1E1B4B" ],
  extra: [
    [ "#A78BFA", "#312E81" ],
    [ "#C084FC", "#581C87" ],
    [ "#6366F1", "#312E81" ]
  ]
)

attach_workspace_gallery!(
  open_desk,
  main: [ "#22C55E", "#064E3B" ],
  extra: [ [ "#86EFAC", "#166534" ] ]
)

attach_workspace_gallery!(
  training_lab,
  main: [ "#F97316", "#7C2D12" ],
  extra: [
    [ "#FDBA74", "#9A3412" ],
    [ "#FB923C", "#7C2D12" ]
  ]
)

attach_workspace_gallery!(
  phone_booth,
  main: [ "#EC4899", "#831843" ],
  extra: [ [ "#F9A8D4", "#9D174D" ] ]
)

attach_workspace_gallery!(
  inactive_workspace,
  main: [ "#94A3B8", "#334155" ],
  extra: []
)

attach_workspace_gallery!(
  starter_desk,
  main: [ "#14B8A6", "#134E4A" ],
  extra: []
)

attach_workspace_gallery!(
  starter_meeting,
  main: [ "#F59E0B", "#78350F" ],
  extra: []
)

attach_workspace_gallery!(
  starter_booth,
  main: [ "#64748B", "#0F172A" ],
  extra: []
)

# -----------------------------------------------------------------------------
# Custom time slots
# -----------------------------------------------------------------------------

puts "Creating custom time slots for Pro organization..."

create_time_slot!(
  organization: pro_org,
  name: "Morning Focus Block",
  start_hour: 9,
  end_hour: 12,
  days: %w[monday tuesday wednesday thursday friday]
)

create_time_slot!(
  organization: pro_org,
  name: "Afternoon Team Block",
  start_hour: 13,
  end_hour: 17,
  days: %w[monday tuesday wednesday thursday friday]
)

create_time_slot!(
  organization: pro_org,
  name: "Saturday Workshop Block",
  start_hour: 10,
  end_hour: 14,
  days: %w[saturday]
)

create_time_slot!(
  organization: pro_org,
  name: "Evening Deep Work",
  start_hour: 18,
  end_hour: 20,
  days: %w[monday tuesday wednesday thursday],
  active: false
)

# -----------------------------------------------------------------------------
# Reservations
# -----------------------------------------------------------------------------

puts "Creating reservations..."

current_start = Time.current - 35.minutes
current_end = Time.current + 55.minutes

# This record represents an already-running reservation. It bypasses creation-time
# validations because the start time is already in the past, which is expected for
# an in-progress demo record.
create_reservation!(
  organization: pro_org,
  user: pro_member_three,
  workspace: phone_booth,
  start_time: current_start,
  end_time: current_end,
  status: "confirmed",
  attendees_count: 1,
  notes: "Active now demo reservation for occupancy and dashboard visibility.",
  validate: false
)

morning_start = next_weekday_time(hour: 9, days_from_now: 1)
afternoon_start = next_weekday_time(hour: 13, days_from_now: 2)
second_morning_start = next_weekday_time(hour: 9, days_from_now: 3)
saturday_start = next_saturday_time(hour: 10, days_from_now: 1)

create_reservation!(
  organization: pro_org,
  user: pro_member,
  workspace: focus_room,
  start_time: morning_start,
  end_time: morning_start + 3.hours,
  status: "confirmed",
  attendees_count: 2,
  notes: "Upcoming member booking for dashboard and My Bookings."
)

create_reservation!(
  organization: pro_org,
  user: pro_member_two,
  workspace: board_room,
  start_time: afternoon_start,
  end_time: afternoon_start + 4.hours,
  status: "confirmed",
  attendees_count: 8,
  notes: "Quarterly planning session with the operations team."
)

create_reservation!(
  organization: pro_org,
  user: pro_admin,
  workspace: open_desk,
  start_time: second_morning_start,
  end_time: second_morning_start + 3.hours,
  status: "confirmed",
  attendees_count: 1,
  notes: "Individual work block for usage insights."
)

create_reservation!(
  organization: pro_org,
  user: pro_manager,
  workspace: training_lab,
  start_time: saturday_start,
  end_time: saturday_start + 4.hours,
  status: "confirmed",
  attendees_count: 18,
  notes: "Saturday workshop. Demonstrates weekend bookings on Pro."
)

past_one = previous_weekday_time(hour: 9, days_ago: 4)
past_two = previous_weekday_time(hour: 13, days_ago: 6)

create_reservation!(
  organization: pro_org,
  user: pro_member,
  workspace: open_desk,
  start_time: past_one,
  end_time: past_one + 3.hours,
  status: "concluded",
  attendees_count: 1,
  notes: "Past completed reservation for booking history."
)

create_reservation!(
  organization: pro_org,
  user: pro_member_two,
  workspace: focus_room,
  start_time: past_two,
  end_time: past_two + 4.hours,
  status: "concluded",
  attendees_count: 3,
  notes: "Completed team sync for dashboard activity."
)

cancelled_start = next_weekday_time(hour: 13, days_from_now: 5)

create_reservation!(
  organization: pro_org,
  user: pro_member_three,
  workspace: board_room,
  start_time: cancelled_start,
  end_time: cancelled_start + 4.hours,
  status: "cancelled",
  attendees_count: 6,
  notes: "Cancelled booking for filter and status demos."
)

starter_future = next_weekday_time(hour: 10, days_from_now: 2)
starter_future_two = next_weekday_time(hour: 14, days_from_now: 3)
starter_past = previous_weekday_time(hour: 10, days_ago: 5)
starter_cancelled = next_weekday_time(hour: 10, days_from_now: 6)

create_reservation!(
  organization: starter_org,
  user: starter_member,
  workspace: starter_desk,
  start_time: starter_future,
  end_time: starter_future + 2.hours,
  status: "confirmed",
  attendees_count: 1,
  notes: "Starter plan sample booking."
)

create_reservation!(
  organization: starter_org,
  user: starter_manager,
  workspace: starter_meeting,
  start_time: starter_future_two,
  end_time: starter_future_two + 2.hours,
  status: "confirmed",
  attendees_count: 4,
  notes: "Starter manager reservation for standard booking rules."
)

create_reservation!(
  organization: starter_org,
  user: starter_member,
  workspace: starter_booth,
  start_time: starter_past,
  end_time: starter_past + 2.hours,
  status: "concluded",
  attendees_count: 1,
  notes: "Past Starter reservation."
)

create_reservation!(
  organization: starter_org,
  user: starter_member,
  workspace: starter_meeting,
  start_time: starter_cancelled,
  end_time: starter_cancelled + 2.hours,
  status: "cancelled",
  attendees_count: 3,
  notes: "Cancelled Starter reservation."
)

# -----------------------------------------------------------------------------
# Invitations
# -----------------------------------------------------------------------------

puts "Creating sample invitations..."

OrganizationInvitation.create!(
  organization: pro_org,
  role: roles[:member],
  invited_by: pro_manager,
  email: "alex.johnson@slotify.test",
  status: "pending",
  expires_at: 7.days.from_now
)

OrganizationInvitation.create!(
  organization: pro_org,
  role: roles[:manager],
  invited_by: pro_admin,
  email: "rebecca.white@slotify.test",
  status: "pending",
  expires_at: 5.days.from_now
)

OrganizationInvitation.create!(
  organization: starter_org,
  role: roles[:member],
  invited_by: starter_manager,
  email: "kevin.harris@slotify.test",
  status: "pending",
  expires_at: 7.days.from_now
)

puts ""
puts "Seed completed."
puts ""
puts "Demo login credentials"
puts "--------------------------------------------------"
puts "Pro Manager:        manager@slotify.test / #{PASSWORD}           (Emily Carter)"
puts "Pro Admin:          admin@slotify.test / #{PASSWORD}             (Michael Anderson)"
puts "Pro Member:         member@slotify.test / #{PASSWORD}            (Sarah Mitchell)"
puts "Pro Member 2:       james@slotify.test / #{PASSWORD}             (James Parker)"
puts "Pro Member 3:       olivia@slotify.test / #{PASSWORD}            (Olivia Bennett)"
puts "Inactive Member:    inactive-member@slotify.test / #{PASSWORD}   (Ryan Brooks)"
puts "Unconfirmed Member: unconfirmed-member@slotify.test / #{PASSWORD} (Hannah Lewis)"
puts "Starter Manager:    starter-manager@slotify.test / #{PASSWORD}   (David Miller)"
puts "Starter Member:     starter-member@slotify.test / #{PASSWORD}    (Megan Wilson)"
puts "--------------------------------------------------"
puts ""
puts "Recommended demo flow:"
puts "1. Sign in as manager@slotify.test to show dashboard, organization, members, plans, time slots and management."
puts "2. Sign in as member@slotify.test to show My Bookings and the member reservation flow."
puts "3. Sign in as starter-manager@slotify.test to show Starter limits and unavailable Pro features."
puts "4. Sign in as inactive-member@slotify.test to show inactive account handling."
