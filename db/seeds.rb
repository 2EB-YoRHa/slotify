admin_role = Role.find_or_create_by!(name: "admin")
manager_role = Role.find_or_create_by!(name: "manager")
member_role = Role.find_or_create_by!(name: "member")

organization = Organization.find_or_create_by!(slug: "slotify-demo") do |org|
  org.name = "Slotify Demo"
  org.email = "admin@slotify.com"
  org.phone = "8888-8888"
  org.address = "San José, Costa Rica"
end

User.find_or_create_by!(email: "admin@slotify.com") do |user|
  user.name = "Admin Slotify"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = admin_role
  user.organization = organization
  user.active = true
end

User.find_or_create_by!(email: "manager@slotify.com") do |user|
  user.name = "Manager Slotify"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = manager_role
  user.organization = organization
  user.active = true
end

User.find_or_create_by!(email: "member@slotify.com") do |user|
  user.name = "Member Slotify"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = member_role
  user.organization = organization
  user.active = true
end

organization.subscriptions.find_or_create_by!(plan_name: "pro") do |subscription|
  subscription.status = "active"
  subscription.starts_at = Time.current
  subscription.ends_at = 1.month.from_now
end