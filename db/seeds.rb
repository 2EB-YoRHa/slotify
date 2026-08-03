puts "Cleaning demo database..."

ActiveRecord::Base.transaction do
  %w[
    Payment
    Subscription
    OrganizationInvitation
    Reservation
    WorkspaceAmenity
    Workspace
    Amenity
    BookingRule
    User
    Organization
    Role
  ].each do |model_name|
    model = model_name.safe_constantize
    model&.destroy_all
  end
end

puts "Creating roles..."

admin_role = Role.create!(name: "admin")
manager_role = Role.create!(name: "manager")
member_role = Role.create!(name: "member")

PASSWORD = "Password123!"

def create_user!(name:, email:, role:, organization:, active: true)
  User.create!(
    name: name,
    email: email,
    password: PASSWORD,
    password_confirmation: PASSWORD,
    role: role,
    organization: organization,
    active: active
  )
end

def next_weekday(days_from_now)
  date = Time.zone.today + days_from_now.days

  while date.saturday? || date.sunday?
    date += 1.day
  end

  date
end

def previous_weekday(days_ago)
  date = Time.zone.today - days_ago.days

  while date.saturday? || date.sunday?
    date -= 1.day
  end

  date
end

def at_time(date, hour, minute = 0)
  Time.zone.local(date.year, date.month, date.day, hour, minute)
end

def next_start_within_24_hours
  now = Time.zone.now
  candidate = (now + 2.hours).change(min: 0, sec: 0)

  if candidate.hour < 9
    candidate = candidate.change(hour: 9)
  elsif candidate.hour > 16
    tomorrow = now.to_date + 1.day
    candidate = Time.zone.local(tomorrow.year, tomorrow.month, tomorrow.day, 9, 0)
  end

  candidate
end

def create_reservation!(
  organization:,
  user:,
  workspace:,
  start_time:,
  end_time:,
  status:,
  attendees_count:,
  notes:,
  validate: true
)
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

  if reservation.respond_to?(:total_price=)
    hours = ((end_time - start_time) / 3600.0).round(2)
    reservation.total_price = (workspace.hourly_rate.to_f * hours).round(2)
  end

  validate ? reservation.save! : reservation.save!(validate: false)

  reservation
end

def print_time(label, time)
  puts "#{label}: #{time.strftime('%a, %b %d %Y %I:%M %p')}"
end

puts "Creating organizations..."

northstar = Organization.create!(
  name: "Northstar Coworking",
  slug: "northstar-coworking",
  email: "hello@northstar.test",
  phone: "+1 415 555 0128",
  address: "120 Market Street, San Francisco, CA"
)

harbor = Organization.create!(
  name: "Harbor Desk Studios",
  slug: "harbor-desk-studios",
  email: "team@harbordesk.test",
  phone: "+1 206 555 0184",
  address: "88 Pier Avenue, Seattle, WA"
)

puts "Creating users..."

admin = create_user!(
  name: "Platform Admin",
  email: "admin@slotify.test",
  role: admin_role,
  organization: northstar
)

manager = create_user!(
  name: "Olivia Bennett",
  email: "manager@slotify.test",
  role: manager_role,
  organization: northstar
)

operations_manager = create_user!(
  name: "Ethan Brooks",
  email: "operations@slotify.test",
  role: manager_role,
  organization: northstar
)

ava = create_user!(
  name: "Ava Johnson",
  email: "ava@slotify.test",
  role: member_role,
  organization: northstar
)

noah = create_user!(
  name: "Noah Miller",
  email: "noah@slotify.test",
  role: member_role,
  organization: northstar
)

mia = create_user!(
  name: "Mia Carter",
  email: "mia@slotify.test",
  role: member_role,
  organization: northstar
)

lucas = create_user!(
  name: "Lucas Brown",
  email: "lucas@slotify.test",
  role: member_role,
  organization: northstar
)

inactive_member = create_user!(
  name: "Liam Anderson",
  email: "inactive@slotify.test",
  role: member_role,
  organization: northstar,
  active: false
)

harbor_manager = create_user!(
  name: "Sophia Reed",
  email: "manager@harbordesk.test",
  role: manager_role,
  organization: harbor
)

harbor_member = create_user!(
  name: "James Parker",
  email: "member@harbordesk.test",
  role: member_role,
  organization: harbor
)

puts "Creating amenities..."

amenities = {
  wifi: Amenity.create!(name: "High-Speed Wi-Fi"),
  projector: Amenity.create!(name: "4K Projector"),
  whiteboard: Amenity.create!(name: "Whiteboard"),
  video: Amenity.create!(name: "Video Conferencing"),
  coffee: Amenity.create!(name: "Coffee Bar"),
  parking: Amenity.create!(name: "Reserved Parking"),
  air: Amenity.create!(name: "Air Conditioning"),
  natural_light: Amenity.create!(name: "Natural Light"),
  smart_tv: Amenity.create!(name: "Smart TV"),
  printer: Amenity.create!(name: "Printer Access"),
  phone_booth: Amenity.create!(name: "Private Phone Booth"),
  standing_desk: Amenity.create!(name: "Standing Desks"),
  soundproof: Amenity.create!(name: "Soundproof Walls")
}

puts "Creating Northstar workspaces..."

summit_boardroom = northstar.workspaces.create!(
  name: "Summit Boardroom",
  workspace_type: "meeting_room",
  capacity: 12,
  floor: "5",
  zone: "Executive Wing",
  location: "North Tower, 5th Floor",
  description: "Premium boardroom for client presentations, leadership meetings, and strategy sessions.",
  hourly_rate: 45.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:projector],
    amenities[:whiteboard],
    amenities[:video],
    amenities[:coffee],
    amenities[:air],
    amenities[:smart_tv]
  ]
)

focus_booth = northstar.workspaces.create!(
  name: "Focus Booth A",
  workspace_type: "phone_booth",
  capacity: 1,
  floor: "2",
  zone: "Quiet Zone",
  location: "North Tower, 2nd Floor",
  description: "Private booth for focused calls, interviews, and individual work sessions.",
  hourly_rate: 12.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:phone_booth],
    amenities[:soundproof],
    amenities[:air]
  ]
)

creative_studio = northstar.workspaces.create!(
  name: "Creative Studio",
  workspace_type: "training_room",
  capacity: 16,
  floor: "3",
  zone: "Innovation Lab",
  location: "East Building, 3rd Floor",
  description: "Flexible room for workshops, training sessions, and design activities.",
  hourly_rate: 55.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:projector],
    amenities[:whiteboard],
    amenities[:video],
    amenities[:natural_light],
    amenities[:coffee],
    amenities[:smart_tv]
  ]
)

open_lounge = northstar.workspaces.create!(
  name: "Open Desk Lounge",
  workspace_type: "open_desk",
  capacity: 8,
  floor: "1",
  zone: "Main Lounge",
  location: "Main Building, Ground Floor",
  description: "Flexible open desk area for members who need a casual workspace during the day.",
  hourly_rate: 10.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:coffee],
    amenities[:printer],
    amenities[:natural_light],
    amenities[:standing_desk]
  ]
)

private_office = northstar.workspaces.create!(
  name: "Private Office 204",
  workspace_type: "private_office",
  capacity: 4,
  floor: "2",
  zone: "Private Offices",
  location: "North Tower, Office 204",
  description: "Private office for small teams that need confidentiality and dedicated space.",
  hourly_rate: 35.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:whiteboard],
    amenities[:air],
    amenities[:coffee]
  ]
)

podcast_room = northstar.workspaces.create!(
  name: "Podcast Room",
  workspace_type: "meeting_room",
  capacity: 2,
  floor: "2",
  zone: "Media Corner",
  location: "North Tower, Room 215",
  description: "Small soundproof space for recordings, interviews, and private calls.",
  hourly_rate: 28.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:soundproof],
    amenities[:video],
    amenities[:air]
  ]
)

legacy_room = northstar.workspaces.create!(
  name: "Legacy Training Room",
  workspace_type: "training_room",
  capacity: 6,
  floor: "1",
  zone: "South Wing",
  location: "Main Building, Room 110",
  description: "Inactive room kept in the system to preserve historical reservation records.",
  hourly_rate: 25.00,
  active: false,
  amenities: [
    amenities[:wifi],
    amenities[:whiteboard],
    amenities[:air]
  ]
)

puts "Creating Harbor Desk workspaces..."

harbor_room = harbor.workspaces.create!(
  name: "Harbor Meeting Room",
  workspace_type: "meeting_room",
  capacity: 8,
  floor: "1",
  zone: "Dockside Area",
  location: "Main Studio, 1st Floor",
  description: "Meeting room for the secondary organization used to demonstrate data isolation.",
  hourly_rate: 30.00,
  active: true,
  amenities: [
    amenities[:wifi],
    amenities[:whiteboard],
    amenities[:video]
  ]
)

puts "Creating booking rules..."

northstar.create_booking_rule!(
  max_hours_per_reservation: 2,
  min_notice_minutes: 60,
  cancellation_limit_hours: 24,
  allow_weekend_bookings: false
)

harbor.create_booking_rule!(
  max_hours_per_reservation: 2,
  min_notice_minutes: 120,
  cancellation_limit_hours: 12,
  allow_weekend_bookings: false
)

puts "Creating subscriptions and demo payments..."

northstar_subscription = northstar.subscriptions.create!(
  plan_name: "pro",
  status: "active",
  starts_at: 15.days.ago,
  ends_at: 45.days.from_now,
  workspace_limit: nil,
  user_limit: nil
)

northstar_subscription.payments.create!(
  amount: 49.00,
  currency: "USD",
  status: "paid",
  payment_provider: "demo",
  provider_payment_id: "demo-northstar-payment-001",
  paid_at: 15.days.ago
)

harbor_subscription = harbor.subscriptions.create!(
  plan_name: "starter",
  status: "active",
  starts_at: 10.days.ago,
  ends_at: 20.days.from_now,
  workspace_limit: 10,
  user_limit: 20
)

harbor_subscription.payments.create!(
  amount: 19.00,
  currency: "USD",
  status: "paid",
  payment_provider: "demo",
  provider_payment_id: "demo-harbor-payment-001",
  paid_at: 10.days.ago
)

puts "Creating pending invitations..."

northstar.organization_invitations.create!(
  email: "oliver.wilson@northstar.test",
  role: member_role,
  invited_by: manager,
  status: "pending",
  token: "demo-member-oliver-token",
  expires_at: 7.days.from_now
)

northstar.organization_invitations.create!(
  email: "grace.evans@northstar.test",
  role: member_role,
  invited_by: manager,
  status: "pending",
  token: "demo-member-grace-token",
  expires_at: 7.days.from_now
)

northstar.organization_invitations.create!(
  email: "henry.adams@northstar.test",
  role: manager_role,
  invited_by: manager,
  status: "pending",
  token: "demo-manager-henry-token",
  expires_at: 7.days.from_now
)

harbor.organization_invitations.create!(
  email: "emily.clark@harbordesk.test",
  role: member_role,
  invited_by: harbor_manager,
  status: "pending",
  token: "demo-harbor-emily-token",
  expires_at: 7.days.from_now
)

puts "Creating reservations..."

current_start = Time.current.beginning_of_hour - 1.hour
current_end = current_start + 2.hours

cancellation_blocked_start = next_start_within_24_hours
cancellation_blocked_end = cancellation_blocked_start + 1.hour

overlap_date = next_weekday(1)
edit_test_date = next_weekday(2)
cancellation_allowed_date = next_weekday(3)
future_confirmed_date = next_weekday(4)
last_weekday = previous_weekday(1)
older_weekday = previous_weekday(4)

current_reservation = create_reservation!(
  organization: northstar,
  user: ava,
  workspace: summit_boardroom,
  start_time: current_start,
  end_time: current_end,
  status: "confirmed",
  attendees_count: 8,
  notes: "Currently active leadership planning session.",
  validate: false
)

cancellation_blocked_reservation = create_reservation!(
  organization: northstar,
  user: noah,
  workspace: open_lounge,
  start_time: cancellation_blocked_start,
  end_time: cancellation_blocked_end,
  status: "confirmed",
  attendees_count: 1,
  notes: "Cancellation test: this reservation starts in less than 24 hours, so cancellation should be blocked.",
  validate: false
)

overlap_reservation = create_reservation!(
  organization: northstar,
  user: mia,
  workspace: creative_studio,
  start_time: at_time(overlap_date, 10, 0),
  end_time: at_time(overlap_date, 12, 0),
  status: "confirmed",
  attendees_count: 12,
  notes: "Overlap test: Creative Studio is already reserved from 10:00 AM to 12:00 PM."
)

create_reservation!(
  organization: northstar,
  user: lucas,
  workspace: focus_booth,
  start_time: at_time(overlap_date, 13, 0),
  end_time: at_time(overlap_date, 14, 0),
  status: "confirmed",
  attendees_count: 1,
  notes: "Capacity test reference: Focus Booth only supports one attendee."
)

edit_test_reservation = create_reservation!(
  organization: northstar,
  user: manager,
  workspace: private_office,
  start_time: at_time(edit_test_date, 9, 0),
  end_time: at_time(edit_test_date, 11, 0),
  status: "confirmed",
  attendees_count: 3,
  notes: "Edit test: this reservation can be edited and should not conflict with itself."
)

cancellation_allowed_reservation = create_reservation!(
  organization: northstar,
  user: ava,
  workspace: podcast_room,
  start_time: at_time(cancellation_allowed_date, 13, 0),
  end_time: at_time(cancellation_allowed_date, 15, 0),
  status: "confirmed",
  attendees_count: 2,
  notes: "Cancellation test: this reservation starts more than 24 hours from now, so cancellation should be allowed."
)

future_confirmed_reservation = create_reservation!(
  organization: northstar,
  user: noah,
  workspace: summit_boardroom,
  start_time: at_time(future_confirmed_date, 14, 0),
  end_time: at_time(future_confirmed_date, 15, 0),
  status: "confirmed",
  attendees_count: 6,
  notes: "Upcoming confirmed booking for a client presentation."
)

concluded_reservation = create_reservation!(
  organization: northstar,
  user: mia,
  workspace: summit_boardroom,
  start_time: at_time(last_weekday, 11, 0),
  end_time: at_time(last_weekday, 12, 0),
  status: "concluded",
  attendees_count: 6,
  notes: "Historical concluded partner meeting. This reservation should not be editable or cancellable.",
  validate: false
)

cancelled_reservation = create_reservation!(
  organization: northstar,
  user: lucas,
  workspace: legacy_room,
  start_time: at_time(older_weekday, 9, 0),
  end_time: at_time(older_weekday, 10, 0),
  status: "cancelled",
  attendees_count: 4,
  notes: "Historical cancelled reservation used to demonstrate cancellation history.",
  validate: false
)

harbor_reservation = create_reservation!(
  organization: harbor,
  user: harbor_member,
  workspace: harbor_room,
  start_time: at_time(overlap_date, 9, 0),
  end_time: at_time(overlap_date, 10, 0),
  status: "confirmed",
  attendees_count: 4,
  notes: "Secondary organization reservation used to demonstrate data isolation."
)

puts ""
puts "Seed completed successfully."
puts "------------------------------------------------------------"
puts "Primary demo organization: Northstar Coworking"
puts ""
puts "Login credentials:"
puts "Admin:             admin@slotify.test / #{PASSWORD}"
puts "Manager:           manager@slotify.test / #{PASSWORD}"
puts "Operations:        operations@slotify.test / #{PASSWORD}"
puts "Member Ava:        ava@slotify.test / #{PASSWORD}"
puts "Member Noah:       noah@slotify.test / #{PASSWORD}"
puts "Member Mia:        mia@slotify.test / #{PASSWORD}"
puts "Member Lucas:      lucas@slotify.test / #{PASSWORD}"
puts "Inactive Member:   inactive@slotify.test / #{PASSWORD}"
puts ""
puts "Secondary organization:"
puts "Harbor Manager:    manager@harbordesk.test / #{PASSWORD}"
puts "Harbor Member:     member@harbordesk.test / #{PASSWORD}"
puts ""
puts "Demo reservation references:"
print_time("Current active reservation", current_reservation.start_time)
print_time("Cancellation blocked reservation", cancellation_blocked_reservation.start_time)
print_time("Overlap test reservation", overlap_reservation.start_time)
print_time("Editable future reservation", edit_test_reservation.start_time)
print_time("Cancellation allowed reservation", cancellation_allowed_reservation.start_time)
print_time("Future confirmed reservation", future_confirmed_reservation.start_time)
print_time("Concluded reservation", concluded_reservation.start_time)
print_time("Cancelled reservation", cancelled_reservation.start_time)
puts ""
puts "Invitation tokens:"
puts "Member token:      demo-member-oliver-token"
puts "Manager token:     demo-manager-henry-token"
puts "------------------------------------------------------------"
