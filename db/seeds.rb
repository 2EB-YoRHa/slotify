puts "Cleaning database..."

ActiveStorage::Attachment.destroy_all
ActiveStorage::Blob.destroy_all

Payment.destroy_all
Reservation.destroy_all
BookingTimeSlot.destroy_all
BookingRule.destroy_all
WorkspaceAmenity.destroy_all
Workspace.destroy_all
OrganizationInvitation.destroy_all
Subscription.destroy_all
User.destroy_all
Organization.destroy_all
Amenity.destroy_all
Role.destroy_all

puts "Creating roles..."

roles = {
  manager: Role.create!(name: "manager"),
  admin: Role.create!(name: "admin"),
  member: Role.create!(name: "member")
}

puts "Creating amenities..."

amenities = [
  "Air Conditioning",
  "High-Speed WiFi",
  "Whiteboard",
  "TV Screen",
  "Video Conference",
  "Coffee Station",
  "Natural Light",
  "Private Entrance",
  "Standing Desk",
  "Printer Access",
  "Soundproofing",
  "Projector"
].index_by do |name|
  Amenity.create!(name: name)
end

def create_organization!(name:, slug:, email:, phone:, address:)
  Organization.create!(
    name: name,
    slug: slug,
    email: email,
    phone: phone,
    address: address
  )
end

def create_user!(organization:, role:, name:, email:)
  User.create!(
    organization: organization,
    role: role,
    name: name,
    email: email,
    password: "Password123!",
    password_confirmation: "Password123!",
    active: true,
    confirmed_at: Time.current
  )
end

def create_subscription!(organization:, plan_name:)
  plan = SubscriptionPlan.find!(plan_name)

  Subscription.create!(
    organization: organization,
    plan_name: plan_name,
    status: "active",
    starts_at: 1.day.ago,
    ends_at: 30.days.from_now,
    workspace_limit: plan[:workspace_limit],
    user_limit: plan[:user_limit]
  )
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

  workspace.amenities = amenities
  workspace.save!

  workspace
end

def next_weekday_time(hour:, minute: 0, days_from_now: 1)
  date = Time.zone.today + days_from_now.days

  loop do
    candidate = Time.zone.local(date.year, date.month, date.day, hour, minute)

    return candidate if candidate.future? && !candidate.saturday? && !candidate.sunday?

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

def create_reservation!(organization:, user:, workspace:, start_time:, end_time:, status: "confirmed", attendees_count: 1, notes: nil)
  Reservation.create!(
    organization: organization,
    user: user,
    workspace: workspace,
    start_time: start_time,
    end_time: end_time,
    status: status,
    attendees_count: attendees_count,
    notes: notes
  )
end

puts "Creating organizations..."

pro_org = create_organization!(
  name: "Astra Coworking",
  slug: "astra-coworking",
  email: "hello@astra-coworking.test",
  phone: "+506 2222-1000",
  address: "San José, Costa Rica"
)

starter_org = create_organization!(
  name: "Starter Studio",
  slug: "starter-studio",
  email: "hello@starter-studio.test",
  phone: "+506 2222-2000",
  address: "Heredia, Costa Rica"
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

puts "Creating users..."

pro_manager = create_user!(
  organization: pro_org,
  role: roles[:manager],
  name: "Morrigan Manager",
  email: "manager@slotify.test"
)

pro_admin = create_user!(
  organization: pro_org,
  role: roles[:admin],
  name: "Astra Admin",
  email: "admin@slotify.test"
)

pro_member = create_user!(
  organization: pro_org,
  role: roles[:member],
  name: "Morrigan Member",
  email: "member@slotify.test"
)

starter_manager = create_user!(
  organization: starter_org,
  role: roles[:manager],
  name: "Starter Manager",
  email: "starter-manager@slotify.test"
)

starter_member = create_user!(
  organization: starter_org,
  role: roles[:member],
  name: "Starter Member",
  email: "starter-member@slotify.test"
)

inactive_member = User.create!(
  organization: pro_org,
  role: roles[:member],
  name: "Inactive Member",
  email: "inactive-member@slotify.test",
  password: "Password123!",
  password_confirmation: "Password123!",
  active: false,
  confirmed_at: Time.current
)

unconfirmed_member = User.create!(
  organization: pro_org,
  role: roles[:member],
  name: "Unconfirmed Member",
  email: "unconfirmed-member@slotify.test",
  password: "Password123!",
  password_confirmation: "Password123!",
  active: true
)

puts "Creating workspaces..."

focus_room = create_workspace!(
  organization: pro_org,
  name: "Focus Room",
  workspace_type: "private_office",
  capacity: 4,
  floor: "2nd",
  zone: "North Wing",
  location: "Astra Coworking - Building A",
  description: "Private office for focused work, calls, and small team sessions.",
  hourly_rate: 45,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"],
    amenities["Standing Desk"],
    amenities["Soundproofing"]
  ]
)

board_room = create_workspace!(
  organization: pro_org,
  name: "Board Room",
  workspace_type: "meeting_room",
  capacity: 12,
  floor: "3rd",
  zone: "Executive Area",
  location: "Astra Coworking - Building A",
  description: "Large meeting room with screen, whiteboard, and video conference setup.",
  hourly_rate: 95,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["TV Screen"],
    amenities["Whiteboard"],
    amenities["Video Conference"],
    amenities["Coffee Station"]
  ]
)

open_desk = create_workspace!(
  organization: pro_org,
  name: "Open Desk A",
  workspace_type: "open_desk",
  capacity: 1,
  floor: "1st",
  zone: "Open Area",
  location: "Astra Coworking - Main Floor",
  description: "Flexible desk for individual work with quick access to common areas.",
  hourly_rate: 18,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"],
    amenities["Natural Light"]
  ]
)

training_room = create_workspace!(
  organization: pro_org,
  name: "Training Lab",
  workspace_type: "training_room",
  capacity: 24,
  floor: "4th",
  zone: "Learning Center",
  location: "Astra Coworking - Building B",
  description: "Training room for workshops, onboarding sessions, and team events.",
  hourly_rate: 120,
  active: true,
  amenities: [
    amenities["Projector"],
    amenities["Whiteboard"],
    amenities["High-Speed WiFi"],
    amenities["Air Conditioning"]
  ]
)

inactive_workspace = create_workspace!(
  organization: pro_org,
  name: "Maintenance Office",
  workspace_type: "private_office",
  capacity: 2,
  floor: "1st",
  zone: "Service Area",
  location: "Astra Coworking - Back Office",
  description: "Inactive workspace used to test manager visibility and member restrictions.",
  hourly_rate: 25,
  active: false,
  amenities: [
    amenities["High-Speed WiFi"]
  ]
)

starter_desk = create_workspace!(
  organization: starter_org,
  name: "Starter Desk",
  workspace_type: "open_desk",
  capacity: 1,
  floor: "1st",
  zone: "Main Area",
  location: "Starter Studio - Main Floor",
  description: "Simple desk for individual reservations.",
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
  location: "Starter Studio - Main Floor",
  description: "Small meeting room for starter plan testing.",
  hourly_rate: 40,
  active: true,
  amenities: [
    amenities["High-Speed WiFi"],
    amenities["Whiteboard"],
    amenities["TV Screen"]
  ]
)

puts "Creating custom time slots for Pro organization..."

BookingTimeSlot.create!(
  organization: pro_org,
  name: "Morning Focus Block",
  start_minute: 9 * 60,
  end_minute: 12 * 60,
  days_of_week: "monday,tuesday,wednesday,thursday,friday",
  active: true
)

BookingTimeSlot.create!(
  organization: pro_org,
  name: "Afternoon Team Block",
  start_minute: 13 * 60,
  end_minute: 17 * 60,
  days_of_week: "monday,tuesday,wednesday,thursday,friday",
  active: true
)

BookingTimeSlot.create!(
  organization: pro_org,
  name: "Saturday Workshop Block",
  start_minute: 10 * 60,
  end_minute: 14 * 60,
  days_of_week: "saturday",
  active: true
)

puts "Creating reservations..."

morning_start = next_weekday_time(hour: 9, days_from_now: 1)
morning_end = morning_start + 3.hours

afternoon_start = next_weekday_time(hour: 13, days_from_now: 2)
afternoon_end = afternoon_start + 4.hours

past_start = previous_weekday_time(hour: 9, days_ago: 5)
past_end = past_start + 3.hours

create_reservation!(
  organization: pro_org,
  user: pro_member,
  workspace: focus_room,
  start_time: morning_start,
  end_time: morning_end,
  status: "confirmed",
  attendees_count: 2,
  notes: "Upcoming member booking for dashboard and My Bookings."
)

create_reservation!(
  organization: pro_org,
  user: pro_member,
  workspace: board_room,
  start_time: afternoon_start,
  end_time: afternoon_end,
  status: "confirmed",
  attendees_count: 8,
  notes: "Team planning session."
)

create_reservation!(
  organization: pro_org,
  user: pro_member,
  workspace: open_desk,
  start_time: past_start,
  end_time: past_end,
  status: "concluded",
  attendees_count: 1,
  notes: "Past completed reservation."
)

create_reservation!(
  organization: pro_org,
  user: pro_admin,
  workspace: training_room,
  start_time: next_weekday_time(hour: 13, days_from_now: 4),
  end_time: next_weekday_time(hour: 13, days_from_now: 4) + 4.hours,
  status: "confirmed",
  attendees_count: 18,
  notes: "Training session for manager views."
)

starter_start = next_weekday_time(hour: 10, days_from_now: 3)

create_reservation!(
  organization: starter_org,
  user: starter_member,
  workspace: starter_desk,
  start_time: starter_start,
  end_time: starter_start + 2.hours,
  status: "confirmed",
  attendees_count: 1,
  notes: "Starter plan sample booking."
)

create_reservation!(
  organization: starter_org,
  user: starter_manager,
  workspace: starter_meeting,
  start_time: next_weekday_time(hour: 14, days_from_now: 4),
  end_time: next_weekday_time(hour: 14, days_from_now: 4) + 2.hours,
  status: "confirmed",
  attendees_count: 4,
  notes: "Starter manager sample booking."
)

puts "Creating sample invitations..."

OrganizationInvitation.create!(
  organization: pro_org,
  role: roles[:member],
  invited_by: pro_manager,
  email: "pending-member@slotify.test",
  status: "pending",
  expires_at: 7.days.from_now
)

OrganizationInvitation.create!(
  organization: starter_org,
  role: roles[:member],
  invited_by: starter_manager,
  email: "starter-pending-member@slotify.test",
  status: "pending",
  expires_at: 7.days.from_now
)

puts ""
puts "Seed completed."
puts ""
puts "Login credentials:"
puts "--------------------------------------------------"
puts "Pro Manager:        manager@slotify.test / Password123!"
puts "Pro Admin:          admin@slotify.test / Password123!"
puts "Pro Member:         member@slotify.test / Password123!"
puts "Starter Manager:    starter-manager@slotify.test / Password123!"
puts "Starter Member:     starter-member@slotify.test / Password123!"
puts "Inactive Member:    inactive-member@slotify.test / Password123!"
puts "Unconfirmed Member: unconfirmed-member@slotify.test / Password123!"
puts "--------------------------------------------------"
puts ""
