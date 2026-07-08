# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_06_10_011909) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "amenities", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "booking_rules", force: :cascade do |t|
    t.boolean "allow_weekend_bookings", default: false, null: false
    t.integer "cancellation_limit_hours"
    t.datetime "created_at", null: false
    t.integer "max_hours_per_reservation"
    t.integer "min_notice_minutes"
    t.bigint "organization_id", null: false
    t.datetime "updated_at", null: false
    t.index ["organization_id"], name: "index_booking_rules_on_organization_id"
  end

  create_table "organization_invitations", force: :cascade do |t|
    t.datetime "accepted_at"
    t.datetime "created_at", null: false
    t.string "email"
    t.datetime "expires_at"
    t.bigint "invited_by_id", null: false
    t.bigint "organization_id", null: false
    t.bigint "role_id", null: false
    t.string "status"
    t.string "token"
    t.datetime "updated_at", null: false
    t.index ["invited_by_id"], name: "index_organization_invitations_on_invited_by_id"
    t.index ["organization_id"], name: "index_organization_invitations_on_organization_id"
    t.index ["role_id"], name: "index_organization_invitations_on_role_id"
  end

  create_table "organizations", force: :cascade do |t|
    t.string "address"
    t.datetime "created_at", null: false
    t.string "email"
    t.string "name"
    t.string "phone"
    t.string "slug"
    t.datetime "updated_at", null: false
  end

  create_table "payments", force: :cascade do |t|
    t.decimal "amount"
    t.datetime "created_at", null: false
    t.string "currency"
    t.datetime "paid_at"
    t.string "payment_provider"
    t.string "provider_payment_id"
    t.string "status"
    t.bigint "subscription_id", null: false
    t.datetime "updated_at", null: false
    t.index ["subscription_id"], name: "index_payments_on_subscription_id"
  end

  create_table "reservations", force: :cascade do |t|
    t.integer "attendees_count", default: 1, null: false
    t.datetime "created_at", null: false
    t.datetime "end_time"
    t.text "notes"
    t.bigint "organization_id", null: false
    t.datetime "start_time"
    t.string "status"
    t.datetime "updated_at", null: false
    t.bigint "user_id", null: false
    t.bigint "workspace_id", null: false
    t.index ["organization_id"], name: "index_reservations_on_organization_id"
    t.index ["user_id"], name: "index_reservations_on_user_id"
    t.index ["workspace_id"], name: "index_reservations_on_workspace_id"
  end

  create_table "roles", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.string "name"
    t.datetime "updated_at", null: false
  end

  create_table "subscriptions", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "ends_at"
    t.bigint "organization_id", null: false
    t.string "plan_name"
    t.datetime "starts_at"
    t.string "status"
    t.datetime "updated_at", null: false
    t.integer "user_limit"
    t.integer "workspace_limit"
    t.index ["organization_id"], name: "index_subscriptions_on_organization_id"
  end

  create_table "users", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.datetime "created_at", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "name", null: false
    t.bigint "organization_id"
    t.datetime "remember_created_at"
    t.datetime "reset_password_sent_at"
    t.string "reset_password_token"
    t.bigint "role_id", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["organization_id"], name: "index_users_on_organization_id"
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["role_id"], name: "index_users_on_role_id"
  end

  create_table "workspace_amenities", force: :cascade do |t|
    t.bigint "amenity_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.bigint "workspace_id", null: false
    t.index ["amenity_id"], name: "index_workspace_amenities_on_amenity_id"
    t.index ["workspace_id"], name: "index_workspace_amenities_on_workspace_id"
  end

  create_table "workspaces", force: :cascade do |t|
    t.boolean "active", default: true, null: false
    t.integer "capacity"
    t.datetime "created_at", null: false
    t.text "description"
    t.string "floor"
    t.decimal "hourly_rate"
    t.string "location"
    t.string "name"
    t.bigint "organization_id", null: false
    t.datetime "updated_at", null: false
    t.string "workspace_type"
    t.string "zone"
    t.index ["organization_id"], name: "index_workspaces_on_organization_id"
  end

  add_foreign_key "booking_rules", "organizations"
  add_foreign_key "organization_invitations", "organizations"
  add_foreign_key "organization_invitations", "roles"
  add_foreign_key "organization_invitations", "users", column: "invited_by_id"
  add_foreign_key "payments", "subscriptions"
  add_foreign_key "reservations", "organizations"
  add_foreign_key "reservations", "users"
  add_foreign_key "reservations", "workspaces"
  add_foreign_key "subscriptions", "organizations"
  add_foreign_key "users", "organizations"
  add_foreign_key "users", "roles"
  add_foreign_key "workspace_amenities", "amenities"
  add_foreign_key "workspace_amenities", "workspaces"
  add_foreign_key "workspaces", "organizations"
end
