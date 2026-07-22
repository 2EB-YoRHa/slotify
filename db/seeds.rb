admin_role = Role.find_or_create_by!(name: "admin")
manager_role = Role.find_or_create_by!(name: "manager")
member_role = Role.find_or_create_by!(name: "member")

organization = Organization.find_or_initialize_by(slug: "slotify-demo")

organization.assign_attributes(
  name: "Slotify Demo",
  email: "admin@slotify.com",
  phone: "8888-8888",
  address: "San José, Costa Rica"
)

organization.save!

admin_user = User.find_or_initialize_by(email: "admin@slotify.com")

admin_user.assign_attributes(
  name: "Admin Slotify",
  role: admin_role,
  organization: organization,
  active: true
)

if admin_user.new_record?
  admin_user.password = "password123"
  admin_user.password_confirmation = "password123"
end

admin_user.save!

manager_user = User.find_or_initialize_by(email: "manager@slotify.com")

manager_user.assign_attributes(
  name: "Manager Slotify",
  role: manager_role,
  organization: organization,
  active: true
)

if manager_user.new_record?
  manager_user.password = "password123"
  manager_user.password_confirmation = "password123"
end

manager_user.save!

member_user = User.find_or_initialize_by(email: "member@slotify.com")

member_user.assign_attributes(
  name: "Member Slotify",
  role: member_role,
  organization: organization,
  active: true
)

if member_user.new_record?
  member_user.password = "password123"
  member_user.password_confirmation = "password123"
end

member_user.save!

subscription = organization.subscriptions.find_or_initialize_by(plan_name: "pro")

subscription.assign_attributes(
  status: "active",
  starts_at: Time.current,
  ends_at: 1.month.from_now
)

subscription.save!

puts "Seed completed successfully"
puts "Admin: admin@slotify.com / password123"
puts "Manager: manager@slotify.com / password123"
puts "Member: member@slotify.com / password123"
