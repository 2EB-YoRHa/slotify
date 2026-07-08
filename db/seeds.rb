# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

# Roles
admin_role = Role.find_or_create_by!(name: "admin")

# Organization
organization = Organization.find_or_create_by!(slug: "slotify-demo") do |org|
  org.name = "Slotify Demo"
  org.email = "admin@slotify.com"
  org.phone = "8888-8888"
  org.address = "San José, Costa Rica"
end

# Admin user
User.find_or_create_by!(email: "admin@slotify.com") do |user|
  user.name = "Administrador"
  user.password = "password123"
  user.password_confirmation = "password123"
  user.role = admin_role
  user.organization = organization
  user.active = true
end